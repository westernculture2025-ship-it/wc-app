# Textile Shop Frontend - Angular Application

A complete Angular frontend application for textile shop management with product management, billing system with barcode scanning, and invoice generation.

## Features

### 📦 Product Management
- **CRUD Operations**: Create, Read, Update, Delete products
- **Textile-Specific Fields**: Fabric type, color, pattern, dimensions, stock quantity
- **Search & Filter**: Search products by name, barcode, fabric type, or color
- **Responsive Grid Layout**: Display products in an attractive card-based grid

### 🛒 Billing System
- **Barcode Scanning**: Real-time barcode scanning using QuaggaJS
- **Manual Entry**: Option to manually enter product barcodes
- **Shopping Cart**: Add/remove items, update quantities
- **Customer Details**: Optional customer information capture
- **Payment Methods**: Support for cash, card, UPI, and net banking
- **Tax & Discount**: Configurable tax rates and discount amounts
- **Live Calculations**: Real-time subtotal, tax, and total calculations

### 🧾 Invoice Management
- **Invoice List**: View all generated invoices
- **Invoice Details**: Detailed view of individual invoices
- **PDF Download**: Download invoices as PDF
- **Print Support**: Print-friendly invoice format
- **Customer Information**: Display customer and shop details

## Technology Stack

- **Angular 14**: Frontend framework
- **TypeScript**: Programming language
- **QuaggaJS (@ericblade/quagga2)**: Barcode scanning library
- **HttpClient**: API integration
- **RxJS**: Reactive programming
- **CSS3**: Styling and responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend API server running (default: http://localhost:3000)

## Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure API Endpoint**:
   - Update `src/environments/environment.ts` with your backend API URL
   - Default: `http://localhost:3000/api`

3. **Configure Proxy (for development)**:
   - The `proxy.conf.json` is already configured to proxy `/api` requests to `http://localhost:3000`

## Running the Application

### Development Server

```bash
ng serve --proxy-config proxy.conf.json
```

Or update your `package.json` scripts:

```json
"scripts": {
  "start": "ng serve --proxy-config proxy.conf.json",
  "build": "ng build"
}
```

Then run:

```bash
npm start
```

Navigate to `http://localhost:5200/`

### Production Build

```bash
ng build --prod
```

Build artifacts will be stored in the `dist/` directory.

## API Endpoints Expected

The frontend expects the following API endpoints from the backend:

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/barcode/:barcode` - Get product by barcode
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/search?q=query` - Search products

### Billing/Invoices
- `POST /api/billing/invoice` - Create new invoice
- `GET /api/billing/invoices` - Get all invoices
- `GET /api/billing/invoice/:id` - Get invoice by ID
- `GET /api/billing/invoice/:id/pdf` - Download invoice PDF

## Product Model

```typescript
{
  id?: number;
  name: string;
  description: string;
  price: number;
  barcode: string;
  fabricType?: string;
  color?: string;
  pattern?: string;
  width?: number;
  length?: number;
  stockQuantity?: number;
  unit?: string;
}
```

## Invoice Model

```typescript
{
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

## Barcode Scanner Setup

The barcode scanner uses QuaggaJS and requires:

1. **HTTPS or localhost**: Camera access requires secure context
2. **Camera permissions**: User must grant camera access
3. **Supported formats**: 
   - Code 128
   - EAN-13/EAN-8
   - Code 39
   - UPC
   - Codabar
   - Interleaved 2 of 5

## Browser Compatibility

- Chrome/Edge (recommended for barcode scanning)
- Firefox
- Safari (iOS 11+)

**Note**: Barcode scanning works best in Chrome/Edge browsers with good lighting conditions.

## Project Structure

```
src/
├── app/
│   ├── models/
│   │   ├── product.model.ts
│   │   └── invoice.model.ts
│   ├── services/
│   │   ├── api.service.ts
│   │   └── barcode-scanner.service.ts
│   ├── app.component.ts/html/css
│   ├── product.component.ts/html/css
│   ├── billing.component.ts/html/css
│   ├── invoice.component.ts/html/css
│   └── app.module.ts
├── environments/
│   └── environment.ts
├── styles.css
└── index.html
```

## Customization

### Update Shop Details
Edit `src/app/invoice.component.html` to update shop information:
```html
<p><strong>Your Shop Name</strong></p>
<p>Your Shop Address</p>
<p>Phone: Your Phone</p>
<p>Email: your@email.com</p>
```

### Change Color Theme
Edit CSS files to customize colors:
- Primary color: `#667eea`
- Success color: `#28a745`
- Danger color: `#dc3545`

### Add More Fabric Types
Edit `src/app/product.component.html` to add more fabric options in the dropdown.

## Troubleshooting

### Barcode Scanner Not Working
- Ensure you're using HTTPS or localhost
- Grant camera permissions
- Check browser console for errors
- Try different lighting conditions
- Use Chrome/Edge for best results

### API Connection Issues
- Verify backend server is running
- Check proxy configuration in `proxy.conf.json`
- Verify API URL in `environment.ts`
- Check browser console for network errors

### TypeScript Errors
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Support

For issues or questions, please check:
1. Console errors in browser developer tools
2. Network tab for API request failures
3. Backend server logs

## License

This project is part of the Textile Shop Management System.
