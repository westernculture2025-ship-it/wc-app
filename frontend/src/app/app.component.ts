import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  view = 'home';
  showHeader = true;
  username = '';
  showSidebar = true;
  
  // App configuration from environment
  appName = environment.appConfig.appName;
  appTitle = environment.appConfig.appTitle;
  appSubtitle = environment.appConfig.appSubtitle;
  appVersion = environment.appConfig.version;
  poweredBy = environment.appConfig.poweredBy;
  logoUrl = environment.appConfig.logoUrl;
  useCustomLogo = environment.appConfig.useCustomLogo;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
    }

    // Get username from localStorage
    this.username = localStorage.getItem('username') || 'User';

    // Hide header on login page
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !event.url.includes('/login');
        // Update view based on route
        if (event.url.includes('home')) this.view = 'home';
        else if (event.url.includes('products')) this.view = 'products';
        else if (event.url.includes('billing')) this.view = 'billing';
        else if (event.url.includes('invoices')) this.view = 'invoices';
        else if (event.url.includes('barcode-labels')) this.view = 'barcode-labels';
        else if (event.url.includes('bulk-import')) this.view = 'bulk-import';
        else if (event.url.includes('dashboard')) this.view = 'dashboard';
        else if (event.url.includes('reports')) this.view = 'reports';
      }
    });
  }
  
  setView(viewName: string): void {
    this.view = viewName;
    this.router.navigate(['/' + viewName]);
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
