import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  appName = environment.appConfig.appName;
  
  stats = {
    totalProducts: 0,
    lowStock: 0,
    todaySales: 0,
    pendingInvoices: 0
  };

  recentActivity = [
    { icon: '📦', action: 'New product added', item: 'Cotton Fabric - Blue', time: '2 hours ago' },
    { icon: '🛒', action: 'Sale completed', item: 'Invoice #1234', time: '3 hours ago' },
    { icon: '⚠️', action: 'Low stock alert', item: 'Silk Thread - Red', time: '5 hours ago' },
    { icon: '📦', action: 'Stock updated', item: 'Polyester - White', time: '1 day ago' }
  ];

  quickActions = [
    { icon: '➕', title: 'Add Product', description: 'Add new textile product', route: '/products' },
    { icon: '🛒', title: 'New Sale', description: 'Create new billing invoice', route: '/billing' },
    { icon: '📊', title: 'View Reports', description: 'Check sales reports', route: '/invoices' },
    { icon: '📦', title: 'Manage Stock', description: 'Update inventory', route: '/products' },
    { icon: '📤', title: 'Bulk Import', description: 'Import products via Excel', route: '/bulk-import' }
  ];

  popularProducts = [
    { name: 'Cotton Fabric', type: 'Plain', color: 'White', stock: 150, sales: 45 },
    { name: 'Silk Thread', type: 'Embroidery', color: 'Golden', stock: 89, sales: 32 },
    { name: 'Polyester', type: 'Printed', color: 'Floral', stock: 120, sales: 28 },
    { name: 'Wool Blend', type: 'Solid', color: 'Navy', stock: 75, sales: 21 }
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    // In real app, fetch from API
    this.stats = {
      totalProducts: 247,
      lowStock: 12,
      todaySales: 18,
      pendingInvoices: 5
    };
  }
}
