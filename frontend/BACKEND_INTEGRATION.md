# Backend Integration Guide

## Connecting Frontend to Backend

### Step 1: Configure API URL

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'  // Change port/host as needed
};
```

### Step 2: Development Proxy Setup

The `proxy.conf.json` file is already configured:

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
```

This proxies all `/api/*` requests to your backend server.

### Step 3: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd ../backend  # or your backend directory
npm start      # or your backend start command
```

**Terminal 2 - Frontend:**
```bash
cd textile-frontend
npm start
```

---

## Backend API Contract

### Product Endpoints

#### Get All Products
```
GET /api/products
Response: Product[]
```

#### Get Product by ID
```
GET /api/products/:id
Response: Product
```

#### Get Product by Barcode
```
GET /api/products/barcode/:barcode
Response: Product
```

#### Create Product
```
POST /api/products
Body: Product (without id)
Response: Product (with id)
```

#### Update Product
```
PUT /api/products/:id
Body: Product
Response: Product
```

#### Delete Product
```
DELETE /api/products/:id
Response: { success: boolean }
```

#### Search Products
```
GET /api/products/search?q=searchTerm
Response: Product[]
```

### Invoice Endpoints

#### Create Invoice
```
POST /api/billing/invoice
Body: Invoice (without id)
Response: Invoice (with id and invoiceNumber)
```

#### Get All Invoices
```
GET /api/billing/invoices
Response: Invoice[]
```

#### Get Invoice by ID
```
GET /api/billing/invoice/:id
Response: Invoice
```

#### Download Invoice PDF
```
GET /api/billing/invoice/:id/pdf
Response: Blob (application/pdf)
```

---

## Data Models

### Product Model
```typescript
{
  id?: number;
  name: string;                 // Required
  description: string;
  price: number;                // Required
  barcode: string;              // Required, unique
  fabricType?: string;          // Cotton, Silk, Polyester, etc.
  color?: string;
  pattern?: string;
  width?: number;               // in cm
  length?: number;              // in selected unit
  stockQuantity?: number;
  unit?: string;                // meters, yards, pieces, rolls
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Invoice Model
```typescript
{
  id?: number;
  invoiceNumber?: string;       // Auto-generated recommended
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  items: InvoiceItem[];         // Required
  subtotal: number;             // Required
  tax?: number;
  discount?: number;
  total: number;                // Required
  paymentMethod?: string;       // cash, card, upi, netbanking
  createdAt?: Date;
}
```

### InvoiceItem Model
```typescript
{
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;                // quantity * price
}
```

---

## CORS Configuration

Your backend must allow CORS from the frontend origin.

**Express.js Example:**
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5200',
  credentials: true
}));
```

**Other Frameworks:**
Ensure your backend allows:
- Origin: http://localhost:5200
- Methods: GET, POST, PUT, DELETE
- Headers: Content-Type, Authorization

---

## Sample Backend Responses

### Success Response - Get Product
```json
{
  "id": 1,
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
  "unit": "meters",
  "createdAt": "2025-11-10T10:00:00.000Z",
  "updatedAt": "2025-11-10T10:00:00.000Z"
}
```

### Success Response - Create Invoice
```json
{
  "id": 1,
  "invoiceNumber": "INV-2025-001",
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "customerEmail": "john@example.com",
  "items": [
    {
      "productId": 1,
      "productName": "Cotton Fabric - Blue Floral",
      "quantity": 5,
      "price": 250,
      "total": 1250
    }
  ],
  "subtotal": 1250,
  "tax": 125,
  "discount": 50,
  "total": 1325,
  "paymentMethod": "cash",
  "createdAt": "2025-11-10T10:30:00.000Z"
}
```

### Error Response Format
```json
{
  "error": true,
  "message": "Product not found",
  "statusCode": 404
}
```

---

## Testing the Integration

### 1. Test Products API
```bash
# Backend running on localhost:3000
curl http://localhost:3000/api/products
```

### 2. Test from Frontend
Open browser console (F12) and check Network tab:
- Navigate to Products tab
- Check for GET /api/products request
- Verify response status is 200

### 3. Test Barcode Scanner
- Navigate to Billing tab
- Click "Start Scanner"
- Grant camera permissions
- Scan a barcode
- Check Network tab for GET /api/products/barcode/:code

### 4. Test Invoice Creation
- Add items to cart
- Fill customer details
- Click "Generate Invoice"
- Check for POST /api/billing/invoice
- Verify PDF download GET /api/billing/invoice/:id/pdf

---

## Troubleshooting

### Issue: CORS Error
**Solution:** Enable CORS on backend with proper origin

### Issue: 404 Not Found
**Solution:** Verify backend routes match API contract exactly

### Issue: Can't connect to backend
**Solution:** 
1. Check backend is running
2. Verify port number in proxy.conf.json
3. Restart both servers

### Issue: Barcode not found
**Solution:**
1. Ensure product exists with that barcode
2. Check barcode format matches
3. Verify GET /products/barcode/:code endpoint works

---

## Production Deployment

### Update Environment
Create `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api.com/api'
};
```

### Build for Production
```bash
ng build --configuration production
```

### Deploy Files
Deploy `dist/textile-frontend/` to your web server.

### Configure Web Server
Ensure all routes redirect to `index.html` for Angular routing.

---

## Need Help?

Check these resources:
1. Browser console for JavaScript errors
2. Network tab for API request/response details
3. Backend server logs
4. README.md for detailed documentation
5. QUICKSTART.md for common issues

**Happy Integration! 🚀**
