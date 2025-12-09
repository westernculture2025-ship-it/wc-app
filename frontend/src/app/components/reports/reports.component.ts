import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

interface ReportFilter {
  startDate: string;
  endDate: string;
  reportType: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  loading = false;
  
  // Filter options
  filter: ReportFilter = {
    startDate: '',
    endDate: '',
    reportType: 'sales'
  };
  
  // Report data
  reportData: any[] = [];
  reportSummary = {
    totalSales: 0,
    totalProducts: 0,
    totalQuantity: 0,
    avgSale: 0
  };
  
  // Available report types
  reportTypes = [
    { value: 'sales', label: 'Sales Report' },
    { value: 'inventory', label: 'Inventory Report' },
    { value: 'products', label: 'Product Performance' },
    { value: 'daily', label: 'Daily Summary' }
  ];

  constructor(private apiService: ApiService) {
    // Set default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    this.filter.endDate = today.toISOString().split('T')[0];
    this.filter.startDate = thirtyDaysAgo.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.generateReport();
  }

  generateReport(): void {
    this.loading = true;
    
    if (this.filter.reportType === 'sales') {
      this.generateSalesReport();
    } else if (this.filter.reportType === 'inventory') {
      this.generateInventoryReport();
    } else if (this.filter.reportType === 'products') {
      this.generateProductReport();
    } else if (this.filter.reportType === 'daily') {
      this.generateDailyReport();
    }
  }

  generateSalesReport(): void {
    this.apiService.getInvoices().subscribe({
      next: (invoices: any[]) => {
        // Filter by date range
        const filtered = this.filterByDateRange(invoices);
        
        this.reportData = filtered.map(inv => ({
          date: new Date(inv.invoiceDateTime).toLocaleDateString(),
          invoiceNo: inv.invoiceNumber,
          customer: inv.customer?.name || 'N/A',
          items: inv.invoiceItems?.length || 0,
          total: inv.total
        }));
        
        this.reportSummary.totalSales = filtered.reduce((sum, inv) => sum + (inv.total || 0), 0);
        this.reportSummary.totalProducts = filtered.length;
        this.reportSummary.avgSale = this.reportSummary.totalProducts > 0 
          ? this.reportSummary.totalSales / this.reportSummary.totalProducts 
          : 0;
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error generating sales report:', error);
        this.loading = false;
      }
    });
  }

  generateInventoryReport(): void {
    this.apiService.getProducts().subscribe({
      next: (products: any[]) => {
        this.reportData = products.map(p => ({
          name: p.productName,
          barcode: p.barcode,
          quantity: p.quantity,
          status: p.status,
          value: p.quantity * p.retailPrice
        }));
        
        this.reportSummary.totalProducts = products.length;
        this.reportSummary.totalQuantity = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
        this.reportSummary.totalSales = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.retailPrice || 0)), 0);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error generating inventory report:', error);
        this.loading = false;
      }
    });
  }

  generateProductReport(): void {
    this.apiService.getProducts().subscribe({
      next: (products: any[]) => {
        this.reportData = products.map(p => ({
          name: p.productName,
          supplier: p.supplierName,
          wholesalePrice: p.wholesalePrice,
          retailPrice: p.retailPrice,
          margin: ((p.retailPrice - p.wholesalePrice) / p.retailPrice * 100).toFixed(2) + '%'
        }));
        
        this.reportSummary.totalProducts = products.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error generating product report:', error);
        this.loading = false;
      }
    });
  }

  generateDailyReport(): void {
    this.apiService.getInvoices().subscribe({
      next: (invoices: any[]) => {
        const filtered = this.filterByDateRange(invoices);
        
        // Group by date
        const dailyData = filtered.reduce((acc: any, inv: any) => {
          const date = new Date(inv.invoiceDateTime).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = { date, invoices: 0, total: 0 };
          }
          acc[date].invoices++;
          acc[date].total += inv.total || 0;
          return acc;
        }, {});
        
        this.reportData = Object.values(dailyData);
        this.reportSummary.totalSales = this.reportData.reduce((sum: number, day: any) => sum + day.total, 0);
        this.reportSummary.totalProducts = this.reportData.reduce((sum: number, day: any) => sum + day.invoices, 0);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error generating daily report:', error);
        this.loading = false;
      }
    });
  }

  filterByDateRange(data: any[]): any[] {
    const start = new Date(this.filter.startDate);
    const end = new Date(this.filter.endDate);
    end.setHours(23, 59, 59);
    
    return data.filter(item => {
      const itemDate = new Date(item.invoiceDateTime || item.date);
      return itemDate >= start && itemDate <= end;
    });
  }

  exportReport(): void {
    // Simple CSV export
    const headers = Object.keys(this.reportData[0] || {});
    const csv = [
      headers.join(','),
      ...this.reportData.map(row => headers.map(h => row[h]).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.filter.reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  printReport(): void {
    window.print();
  }
}
