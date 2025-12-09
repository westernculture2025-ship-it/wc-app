import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { Invoice } from '../../models/invoice.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  paginatedInvoices: Invoice[] = [];
  selectedInvoice: Invoice | null = null;
  loading = false;
  searchQuery = '';
  Math = Math;
  showBillView = true; // Toggle between invoice and bill view
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private apiService: ApiService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.apiService.getInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
        this.filteredInvoices = data;
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        this.alertService.error('Failed to load invoices: ' + error.message);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    
    if (!query) {
      this.filteredInvoices = this.invoices;
    } else {
      this.filteredInvoices = this.invoices.filter(invoice => {
        // Search by invoice number
        const invoiceNumber = (invoice.invoiceNumber || invoice.id)?.toString().toLowerCase();
        if (invoiceNumber?.includes(query)) return true;

        // Search by customer name (direct property or nested)
        const customerName = invoice.customerName || invoice.customer?.name;
        if (customerName?.toLowerCase().includes(query)) return true;

        // Search by customer phone (direct property or nested)
        const customerPhone = invoice.customerPhone || invoice.customer?.phoneNumber;
        if (customerPhone?.toString().includes(query)) return true;

        // Search by barcode in invoice items
        const hasBarcode = invoice.invoiceItems?.some(item => 
          item.barcode?.toLowerCase().includes(query)
        );
        if (hasBarcode) return true;

        // Search by product name in invoice items
        const hasProduct = invoice.invoiceItems?.some(item =>
          item.productName?.toLowerCase().includes(query)
        );
        if (hasProduct) return true;

        return false;
      });
    }
    
    this.currentPage = 1; // Reset to first page on search
    this.updatePagination();
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredInvoices.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedInvoices = this.filteredInvoices.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  getPageNumbers(): number[] {
    const maxPagesToShow = 5;
    const pages: number[] = [];
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  viewInvoice(invoice: Invoice): void {
    this.selectedInvoice = invoice;
    this.showBillView = true; // Reset to invoice view
  }

  closeInvoiceView(): void {
    this.selectedInvoice = null;
    this.showBillView = true;
  }

  toggleView(): void {
    this.showBillView = !this.showBillView;
  }

  // Helper methods for bill component
  getCartArray(): any[] {
    if (!this.selectedInvoice) return [];
    return this.selectedInvoice.invoiceItems.map(item => ({
      productName: item.productName,
      barcode: item.barcode,
      hsnCode: item.hsnCode,
      quantity: item.quantity,
      price: item.price,
      discountPercentage: item.discountPercentage,
      discountAmount: item.discountAmount,
      total: item.total
    }));
  }

  getTotalQuantity(): number {
    if (!this.selectedInvoice) return 0;
    return this.selectedInvoice.invoiceItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.selectedInvoice?.subtotal || 0;
  }

  getDiscountAmount(): number {
    return this.selectedInvoice?.discount || 0;
  }

  getTaxableAmount(): number {
    return this.selectedInvoice?.taxableAmount || 0;
  }

  getCgstAmount(): number {
    return this.selectedInvoice?.cgst || 0;
  }

  getSgstAmount(): number {
    return this.selectedInvoice?.sgst || 0;
  }

  getTotalAmount(): number {
    return this.selectedInvoice?.total || 0;
  }

  getCgstRate(): number {
    return this.selectedInvoice?.cgstPercentage || 2.5;
  }

  getSgstRate(): number {
    return this.selectedInvoice?.sgstPercentage || 2.5;
  }

  downloadPDF(invoiceId: number | undefined): void {
    if (!invoiceId) return;
    
    // Find the invoice to view it first
    const invoice = this.invoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
      this.alertService.error('Invoice not found');
      return;
    }
    
    // Show the invoice view if not already shown
    const wasInvoiceView = !!this.selectedInvoice;
    if (!wasInvoiceView) {
      this.selectedInvoice = invoice;
    }
    
    // Wait for the view to render, then generate PDF
    setTimeout(() => {
      const invoiceElement = document.querySelector('.invoice-detail') as HTMLElement;
      
      if (!invoiceElement) {
        this.alertService.error('Invoice view not found');
        return;
      }

      // Hide the action buttons temporarily
      const noPrintElements = invoiceElement.querySelectorAll('.no-print');
      noPrintElements.forEach((el: Element) => {
        (el as HTMLElement).style.display = 'none';
      });

      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Use jsPDF's html method
        pdf.html(invoiceElement, {
          callback: (doc) => {
            doc.save(`invoice-${invoiceId}.pdf`);
            
            // Restore the action buttons
            noPrintElements.forEach((el: Element) => {
              (el as HTMLElement).style.display = '';
            });
            
            // Close invoice view if it wasn't open before
            if (!wasInvoiceView) {
              setTimeout(() => {
                this.selectedInvoice = null;
              }, 500);
            }
            
            this.alertService.success('PDF downloaded successfully');
          },
          x: 10,
          y: 10,
          width: 190, // A4 width minus margins
          windowWidth: 800
        });
      } catch (error: any) {
        // Restore the action buttons in case of error
        noPrintElements.forEach((el: Element) => {
          (el as HTMLElement).style.display = '';
        });
        
        this.alertService.error('Failed to generate PDF: ' + error.message);
      }
    }, 100);
  }

  printInvoice(): void {
    window.print();
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}
