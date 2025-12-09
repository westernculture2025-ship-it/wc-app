import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;

  // App configuration from environment
  appName = environment.appConfig.appName;
  appSubtitle = environment.appConfig.appSubtitle;
  logoUrl = environment.appConfig.logoUrl;
  useCustomLogo = environment.appConfig.useCustomLogo;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    // Debug: Log logo configuration
    console.log('Logo Configuration:', {
      logoUrl: this.logoUrl,
      useCustomLogo: this.useCustomLogo,
      appName: this.appName
    });
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.alertService.warning('Please enter both username and password');
      return;
    }

    this.loading = true;

    // Call real authentication API
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.alertService.error(error.error?.message || 'Invalid username or password');
        this.loading = false;
      }
    });
  }

  onDemoLogin(): void {
    this.username = 'admin';
    this.password = 'admin';
    this.onSubmit();
  }

  onImageError(event: any): void {
    console.error('Logo failed to load:', this.logoUrl);
    console.error('Error event:', event);
    // Fallback to SVG icon if image fails to load
    this.useCustomLogo = false;
  }
}
