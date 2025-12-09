# Quick Start Guide - Textile Shop Frontend

## Getting Started in 3 Steps

### 1. Install Dependencies
```bash
cd textile-frontend
npm install
```

### 2. Configure Backend URL
Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'  // Change to your backend URL
};
```

### 3. Run the Application
```bash
npm start
```

Visit: **http://localhost:5200**

---

## Features Overview

### 📦 Product Management
- Navigate to **Products** tab
- Add new textile products with details (fabric type, color, pattern, dimensions)
- Edit or delete existing products
- Search products by name, barcode, or attributes

### 🛒 Billing System
- Navigate to **Billing** tab
- **Scan Barcode**: Click "Start Scanner" and scan product barcodes
- **Manual Entry**: Enter barcode manually in the text field
- Add items to cart, adjust quantities
- Enter customer details (optional)
- Set tax rate and discount
- Click "Generate Invoice" to create and download PDF

### 🧾 Invoices
- Navigate to **Invoices** tab
- View all generated invoices
- Click on invoice to view details
- Download PDF or print invoice

---

## Barcode Scanner Tips

✅ **Best Practices:**
- Use Chrome or Edge browser
- Ensure good lighting
- Hold barcode steady and at proper distance
- Grant camera permissions when prompted
- Use HTTPS or localhost (required for camera access)

📱 **Supported Barcode Types:**
- Code 128
- EAN-13 / EAN-8
- Code 39
- UPC
- Codabar
- Interleaved 2 of 5

---

## Backend API Requirements

Your backend must implement these endpoints:

### Products API
```
GET    /api/products
GET    /api/products/:id
GET    /api/products/barcode/:barcode
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
GET    /api/products/search?q=query
```

### Billing/Invoice API
```
POST   /api/billing/invoice
GET    /api/billing/invoices
GET    /api/billing/invoice/:id
GET    /api/billing/invoice/:id/pdf
```

---

## Sample Product Data

```json
{
  "name": "Cotton Fabric - Blue Floral",
  "description": "Premium cotton fabric with floral print",
  "price": 250,
  "barcode": "1234567890123",
  "fabricType": "Cotton",
  "color": "Blue",
  "pattern": "Floral",
  "width": 150,
  "length": 10,
  "stockQuantity": 50,
  "unit": "meters"
}
```

---

## Troubleshooting

### Camera Not Working
- Check browser permissions
- Use Chrome/Edge browser
- Ensure HTTPS or localhost
- Check console for errors

### API Errors
- Verify backend server is running
- Check `environment.ts` for correct API URL
- Check browser console Network tab
- Verify CORS settings on backend

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run with custom proxy
ng serve --proxy-config proxy.conf.json
```

---

## Customization

### Change Theme Colors
Edit CSS files and replace:
- `#667eea` - Primary color (purple/blue)
- `#28a745` - Success color (green)
- `#dc3545` - Danger color (red)

### Update Shop Details
Edit `src/app/invoice.component.html` and update:
- Shop name
- Shop address
- Contact information

### Add More Fabric Types
Edit `src/app/product.component.html` dropdown:
```html
<option value="NewFabric">New Fabric Type</option>
```

---

## Support

For help:
1. Check README.md for detailed documentation
2. Check browser console for errors
3. Verify backend server logs
4. Ensure all dependencies are installed

**Enjoy using your Textile Shop Management System! 🧵**
