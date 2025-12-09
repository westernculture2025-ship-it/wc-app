import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { BillingComponent } from './components/billing/billing.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { BarcodeLabelComponent } from './components/barcode-label/barcode-label.component';
import { BulkImportComponent } from './components/bulk-import/bulk-import.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReportsComponent } from './components/reports/reports.component';
import { AlertComponent } from './components/alert/alert.component';

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { BarcodeScannerService } from './services/barcode-scanner.service';
import { AlertService } from './services/alert.service';
import { AuthGuard } from './guards/auth.guard';
import { TwoDecimalDirective } from './services/two-decimal.directive';
import { BillComponent } from './components/bill/bill.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProductComponent,
    BillingComponent,
    InvoiceComponent,
    BarcodeLabelComponent,
    BulkImportComponent,
    DashboardComponent,
    ReportsComponent,
    AlertComponent,
    TwoDecimalDirective,
    BillComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSlideToggleModule
  ],
  providers: [
    ApiService,
    AuthService,
    BarcodeScannerService,
    AlertService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
