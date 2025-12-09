import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

// Type declaration for XLSX (will be loaded from CDN or installed package)
declare var XLSX: any;

interface UploadHistory {
  id: number;
  fileName: string;
  uploadDate: Date;
  totalRecords: number;
  successCount: number;
  failureCount: number;
  status: 'success' | 'partial' | 'failed';
  errors?: string[];
}

@Component({
  selector: 'app-bulk-import',
  templateUrl: './bulk-import.component.html',
  styleUrls: ['./bulk-import.component.css']
})
export class BulkImportComponent implements OnInit {
  uploadHistory: UploadHistory[] = [];
  isProcessing = false;
  selectedFile: File | null = null;
  uploadProgress = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadUploadHistory();
  }

  downloadTemplate(): void {
    const templateData = [
      {
        'Supplier Name': 'Example Supplier',
        'Supplier GST': '29ABCDE1234F1Z5',
        'Product Name': 'Sample Product',
        'Wholesale Price': '100',
        'Retail Price': '150',
        'Fabric Type': 'Cotton',
        'Pattern': 'Solid',
        'Size': 'M',
        'Quantity': '50',
        'HSN Code': '52081100',
        'Status': 'Available'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    // Set column widths
    worksheet['!cols'] = [
      { wch: 20 }, // Supplier Name
      { wch: 18 }, // Supplier GST
      { wch: 25 }, // Product Name
      { wch: 15 }, // Wholesale Price
      { wch: 12 }, // Retail Price
      { wch: 15 }, // Fabric Type
      { wch: 12 }, // Pattern
      { wch: 8 },  // Size
      { wch: 10 }, // Quantity
      { wch: 12 }, // HSN Code
      { wch: 18 }, // Barcode
      { wch: 12 }  // Status
    ];

    const fileName = `Product_Upload_Template_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel' ||
          file.name.endsWith('.csv')) {
        this.selectedFile = file;
      } else {
        alert('Please select a valid Excel (.xlsx, .xls) or CSV file');
        event.target.value = '';
      }
    }
  }

  async uploadFile(): Promise<void> {
    if (!this.selectedFile) {
      alert('Please select a file first');
      return;
    }

    this.isProcessing = true;
    this.uploadProgress = 0;

    try {
      const data = await this.readFile(this.selectedFile);
      const products = this.parseProducts(data);
      
      if (products.length === 0) {
        alert('No valid products found in the file');
        this.isProcessing = false;
        return;
      }

      this.uploadProgress = 30;

      // Process products in batches
      const results = await this.processBulkUpload(products);
      
      this.uploadProgress = 100;

      // Save to upload history
      const historyItem: UploadHistory = {
        id: Date.now(),
        fileName: this.selectedFile.name,
        uploadDate: new Date(),
        totalRecords: products.length,
        successCount: results.successCount,
        failureCount: results.failureCount,
        status: results.failureCount === 0 ? 'success' : 
                results.successCount === 0 ? 'failed' : 'partial',
        errors: results.errors
      };

      this.uploadHistory.unshift(historyItem);
      this.saveUploadHistory();

      // Show results
      if (results.failureCount === 0) {
        alert(`✅ Successfully uploaded ${results.successCount} products!`);
      } else {
        alert(`⚠️ Upload completed:\n✅ Success: ${results.successCount}\n❌ Failed: ${results.failureCount}\n\nCheck upload history for details.`);
      }

      // Reset
      this.selectedFile = null;
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      alert('Error processing file. Please check the format and try again.');
    } finally {
      this.isProcessing = false;
      this.uploadProgress = 0;
    }
  }

  private readFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  private parseProducts(data: any[]): any[] {
    return data.map((row, index) => {
      try {
        return {
            supplierName: row['Supplier Name'] || '',
            supplierGstNumber: row['Supplier GST'] || '',
            productName: row['Product Name'] || '',
            wholesalePrice: parseFloat(row['Wholesale Price']) || 0,
            retailPrice: parseFloat(row['Retail Price']) || 0,
            fabricType: row['Fabric Type'] || '',
            pattern: row['Pattern'] || '',
            size: row['Size'] || '',
            quantity: parseInt(row['Quantity']) || 0,
            hsnCode: row['HSN Code'] || '',
            barcode: row['Barcode'] || '',
            status: row['Status'] || 'Available'
        };
      } catch (error) {
        console.error(`Error parsing row ${index + 2}:`, error);
        return null;
      }
    }).filter(p => p !== null && p.supplierName); // Filter out invalid rows
  }

  private async processBulkUpload(products: any[]): Promise<any> {
    const results = {
      successCount: 0,
      failureCount: 0,
      errors: [] as string[]
    };

    const batchSize = 10;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      for (const product of batch) {
        try {
          // Validate product
          const validation = this.validateProduct(product);
          if (!validation.isValid) {
            results.failureCount++;
            results.errors.push(`Row ${product.rowNumber}: ${validation.errors.join(', ')}`);
            continue;
          }

          // Create product via API
          await this.apiService.createProduct(product).toPromise();
          results.successCount++;
          
          // Update progress
          this.uploadProgress = 30 + ((i + batch.indexOf(product) + 1) / products.length) * 70;
          
        } catch (error: any) {
          results.failureCount++;
          const errorMsg = error?.error?.message || error?.message || 'Unknown error';
          results.errors.push(`Row ${product.rowNumber}: ${errorMsg}`);
        }
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  private validateProduct(product: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!product.supplierName || product.supplierName.trim() === '') {
      errors.push('Supplier name is required');
    }
    if (!product.supplierGstNumber || product.supplierGstNumber.trim() === '') {
      errors.push('Supplier GST is required');
    } else {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(product.supplierGstNumber)) {
        errors.push('Invalid GST number format');
      }
    }
    if (!product.productName || product.productName.trim() === '') {
      errors.push('Product name is required');
    }
    if (!product.wholesalePrice || product.wholesalePrice <= 0) {
      errors.push('Valid wholesale price is required');
    }
    if (!product.retailPrice || product.retailPrice <= 0) {
      errors.push('Valid retail price is required');
    }
    if (product.wholesalePrice && product.retailPrice && product.wholesalePrice > product.retailPrice) {
      errors.push('Wholesale price cannot be greater than retail price');
    }
    if (!product.fabricType || product.fabricType.trim() === '') {
      errors.push('Fabric type is required');
    } else if (product.fabricType.length > 50) {
      errors.push('Fabric type must be less than 50 characters');
    }
    if (!product.pattern || product.pattern.trim() === '') {
      errors.push('Pattern is required');
    } else if (product.pattern.length > 50) {
      errors.push('Pattern must be less than 50 characters');
    }
    if (!product.size || product.size.trim() === '') {
      errors.push('Size is required');
    } else if (product.size.length > 20) {
      errors.push('Size must be less than 20 characters');
    }
    if (product.quantity === undefined || product.quantity === null || product.quantity < 0) {
      errors.push('Valid quantity is required');
    }
    if (!product.hsnCode || product.hsnCode.trim() === '') {
      errors.push('HSN code is required');
    } else if (!/^\d{4,8}$/.test(product.hsnCode)) {
      errors.push('HSN code must be 4-8 digits');
    }
    if (!product.status || product.status.trim() === '') {
      errors.push('Status is required');
    } else if (!['Available', 'Out of Stock', 'Discontinued'].includes(product.status)) {
      errors.push('Status must be: Available, Out of Stock, or Discontinued');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  downloadHistoryFile(history: UploadHistory): void {
    // Create a blob with error details if any
    let content = `Upload Report: ${history.fileName}\n`;
    content += `Date: ${history.uploadDate.toLocaleString()}\n`;
    content += `Total Records: ${history.totalRecords}\n`;
    content += `Success: ${history.successCount}\n`;
    content += `Failed: ${history.failureCount}\n\n`;
    
    if (history.errors && history.errors.length > 0) {
      content += `Errors:\n${history.errors.join('\n')}`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `upload_report_${history.id}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  deleteHistory(history: UploadHistory): void {
    if (confirm(`Delete upload history for "${history.fileName}"?`)) {
      this.uploadHistory = this.uploadHistory.filter(h => h.id !== history.id);
      this.saveUploadHistory();
    }
  }

  private loadUploadHistory(): void {
    const saved = localStorage.getItem('bulk_upload_history');
    if (saved) {
      try {
        this.uploadHistory = JSON.parse(saved).map((h: any) => ({
          ...h,
          uploadDate: new Date(h.uploadDate)
        }));
      } catch (error) {
        console.error('Error loading upload history:', error);
        this.uploadHistory = [];
      }
    }
  }

  private saveUploadHistory(): void {
    try {
      localStorage.setItem('bulk_upload_history', JSON.stringify(this.uploadHistory));
    } catch (error) {
      console.error('Error saving upload history:', error);
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'success': return '✅';
      case 'partial': return '⚠️';
      case 'failed': return '❌';
      default: return '📄';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'success': return 'status-success';
      case 'partial': return 'status-partial';
      case 'failed': return 'status-failed';
      default: return '';
    }
  }
}
