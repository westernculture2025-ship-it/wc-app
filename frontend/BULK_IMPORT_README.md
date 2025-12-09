# Bulk Import Feature - Installation Guide

## Overview
The Bulk Import/Export feature allows you to upload products in bulk using Excel or CSV files. This feature includes:
- ✅ Excel template download with sample data
- ✅ File upload (Excel .xlsx, .xls, CSV)
- ✅ Real-time validation and error reporting
- ✅ Upload history with success/failure tracking
- ✅ Detailed error logs for failed records
- ✅ Batch processing for large files

## Installation Steps

### 1. XLSX Library Setup

**✅ Already Configured!** The XLSX library is loaded via CDN in `index.html`. No additional installation required.

If you prefer to use the npm package instead:
```bash
cd c:\Users\z038343\OneDrive - Alliance\Documents\Karthik\Personal\textile_shop_fullstack\textile-frontend
npm install xlsx
```

Then remove the CDN script tag from `src/index.html` and uncomment the import in `bulk-import.component.ts`.

### 2. Build the Application
```bash
npm run build
```

Or start the development server:
```bash
npm start
```

## Usage Guide

### 1. Download Template
- Navigate to **Bulk Import** from the sidebar
- Click **"Download Template"** button
- An Excel file will be downloaded with sample data and required column format

### 2. Prepare Your Data
Fill in the Excel template with your product data:

**Required Columns:**
- Supplier Name
- Product Name
- Retail Price
- Quantity

**Optional Columns:**
- Supplier GST
- Wholesale Price
- Fabric Type
- Pattern
- Size
- HSN Code
- Barcode
- Status (Available/Out of Stock)

### 3. Upload File
- Click **"Choose Excel or CSV file"** button
- Select your prepared file
- Click **"Upload & Process"**
- Wait for processing to complete

### 4. View Results
- Success/failure count will be displayed
- Check **Upload History** section for details
- Download error report for failed records
- Fix errors and re-upload failed records

## Features Breakdown

### Template Download
- Generates Excel file with proper column headers
- Includes sample row with example data
- Pre-configured column widths for readability

### File Validation
The system validates:
- ✅ File format (Excel or CSV)
- ✅ Required fields (Product Name, Supplier Name, Retail Price, Quantity)
- ✅ Data types (prices must be numbers, quantity must be integer)
- ✅ Barcode format (alphanumeric only)

### Upload History
- Stores upload attempts in localStorage
- Shows file name, date, and statistics
- Status indicators: ✅ Success, ⚠️ Partial, ❌ Failed
- Download detailed error reports
- Delete old history entries

### Error Handling
Each error includes:
- Row number in Excel file
- Specific error message
- Field that caused the error

Example error: `Row 5: Product name is required`

## File Format Example

```
| Supplier Name | Supplier GST    | Product Name  | Wholesale Price | Retail Price | Fabric Type | Pattern | Size | Quantity | HSN Code | Barcode       | Status    |
|---------------|-----------------|---------------|-----------------|--------------|-------------|---------|------|----------|----------|---------------|-----------|
| ABC Textiles  | 29ABCDE1234F1Z5 | Cotton Fabric | 100             | 150          | Cotton      | Solid   | M    | 50       | 52081100 | 1234567890123 | Available |
```

## API Integration

The component calls `ProductService.createProduct()` for each product. Ensure your backend API supports:

**Endpoint:** `POST /api/products`

**Request Body:**
```json
{
  "supplier": {
    "name": "ABC Textiles",
    "gst": "29ABCDE1234F1Z5"
  },
  "name": "Cotton Fabric",
  "wholesalePrice": 100,
  "retailPrice": 150,
  "fabricType": "Cotton",
  "pattern": "Solid",
  "size": "M",
  "quantity": 50,
  "hsnCode": "52081100",
  "barcode": "1234567890123",
  "status": "Available"
}
```

## Troubleshooting

### Issue: xlsx module not found
**Solution:** Run `npm install` to install dependencies

### Issue: Upload fails with network error
**Solution:** Check that backend API is running and accessible

### Issue: All records show as failed
**Solution:** Check backend API response format and error messages

### Issue: Template download doesn't work
**Solution:** Ensure xlsx package is properly installed

### Issue: File upload button disabled
**Solution:** Make sure you've selected a valid Excel or CSV file

## Performance Notes

- **Batch Size:** Processes 10 products at a time
- **Large Files:** Files with 1000+ rows may take several minutes
- **Progress Bar:** Shows real-time upload progress
- **Memory:** Upload history stored in localStorage (limited to browser storage)

## Future Enhancements

Potential improvements:
- [ ] Bulk update existing products
- [ ] Import customers and suppliers
- [ ] Scheduled imports
- [ ] CSV export of existing products
- [ ] Duplicate detection
- [ ] Image upload support
- [ ] Multi-sheet Excel support

## Support

For issues or questions:
1. Check the error message in upload history
2. Download error report for details
3. Verify your Excel format matches the template
4. Ensure backend API is functioning correctly

---

**Created:** December 2, 2025
**Version:** 1.0.0
