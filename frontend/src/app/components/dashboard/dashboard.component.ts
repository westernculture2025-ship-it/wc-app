import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = false;
  
  // Dashboard metrics
  totalProducts = 0;
  totalInvoices = 0;
  totalRevenue = 0;
  lowStockProducts = 0;
  
  // Recent activity
  recentInvoices: any[] = [];
  topProducts: any[] = [];
  
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Load products
    this.apiService.getProducts().subscribe({
      next: (products: any[]) => {
        this.totalProducts = products.length;
        this.lowStockProducts = products.filter(p => p.quantity < 10).length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
    
    // Load invoices
    this.apiService.getInvoices().subscribe({
      next: (invoices: any[]) => {
        this.totalInvoices = invoices.length;
        this.totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
        // Map to display format
        this.recentInvoices = invoices.slice(0, 5).map(inv => ({
          invoiceNo: inv.invoiceNumber,
          customerName: inv.customer?.name || 'N/A',
          date: inv.invoiceDateTime,
          total: inv.total
        }));
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
      }
    });
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }
}
