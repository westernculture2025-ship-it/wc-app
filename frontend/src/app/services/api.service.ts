import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { Invoice } from '../models/invoice.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl || '/api'; // Update this to your backend URL

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Product APIs
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`)
      .pipe(catchError(this.handleError));
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`)
      .pipe(catchError(this.handleError));
  }

  getProductByBarcode(barcode: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/barcode/${barcode}`)
      .pipe(catchError(this.handleError));
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, product, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/products/${id}`, product, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}`)
      .pipe(catchError(this.handleError));
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/search?q=${query}`)
      .pipe(catchError(this.handleError));
  }

  // Invoice/Billing APIs
  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.baseUrl}/billing/invoice`, invoice, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.baseUrl}/billing/invoices`)
      .pipe(catchError(this.handleError));
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.baseUrl}/billing/invoice/${id}`)
      .pipe(catchError(this.handleError));
  }

  downloadInvoicePDF(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/billing/invoice/${id}/pdf`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

   getCustomerByPhone(phoneNumber: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/customers/phone/${phoneNumber}`);
  }

  saveCustomer(customerData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customers/upsert`, customerData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
  
}
