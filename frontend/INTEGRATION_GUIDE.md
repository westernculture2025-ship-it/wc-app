# Frontend-Backend Integration Guide

This document explains how the Angular frontend integrates with the Spring Boot backend.

## Backend Configuration

The backend is configured at: `http://localhost:8080/api`

Update this in `src/environments/environment.ts` if your backend runs on a different port.

## Authentication Flow

### 1. Login Process

1. User enters credentials in the login page
2. Frontend calls `POST /api/auth/login` with username/password
3. Backend validates credentials and returns JWT token
4. Frontend stores the token in localStorage
5. All subsequent API calls include the token in the `Authorization` header

### 2. HTTP Interceptor

The `AuthInterceptorService` automatically:
- Adds JWT token to all API requests
- Handles 401/403 errors by logging out the user
- Redirects to login page if token is invalid

## API Service Integration

The `ApiService` provides methods to interact with the backend:

### Product APIs
- `getProducts()` - Fetch all products
- `getProductById(id)` - Get specific product
- `getProductByBarcode(code)` - Search by barcode
- `createProduct(product)` - Add new product
- `updateProduct(id, product)` - Update existing product
- `deleteProduct(id)` - Delete product
- `searchProducts(query)` - Search products by name

### Billing APIs
- `createInvoice(invoice)` - Create new invoice
- `getInvoices()` - Fetch all invoices
- `getInvoiceById(id)` - Get specific invoice
- `downloadInvoicePDF(id)` - Download invoice as PDF

## Data Models

### Product Model
```typescript
interface Product {
  id?: number;
  supplierName: string;
  supplierGstNumber: string;
  productName: string;
  wholesalePrice: number;
  retailPrice: number;
  fabricType: string;
  pattern: string;
  size: string;
  quantity: number;
  hsnCode: string;
  barcode: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Invoice Model
```typescript
interface Invoice {
  id?: number;
  invoiceNumber?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  paymentMethod?: string;
  createdAt?: Date;
}
```

## CORS Configuration

The backend is configured to accept requests from `http://localhost:5200`.

If you change the frontend port, update the `@CrossOrigin` annotation in the backend controllers.

## Running Both Projects

### Terminal 1 - Backend
```bash
cd textile-backend
mvn spring-boot:run
```

### Terminal 2 - Frontend
```bash
cd textile-frontend
npm start
```

- Backend: http://localhost:8080
- Frontend: http://localhost:5200

## Default Login Credentials

- Username: `admin`
- Password: `admin`

These are defined in the backend's `data.sql` file.

## Troubleshooting

### CORS Errors
- Ensure backend controllers have `@CrossOrigin(origins = \"http://localhost:5200\")`
- Check that frontend is running on port 5200

### Authentication Errors
- Verify JWT token is being stored in localStorage
- Check browser console for interceptor errors
- Ensure backend is running and accessible

### API Errors
- Check backend logs for errors
- Verify database connection
- Ensure MySQL is running and database exists
