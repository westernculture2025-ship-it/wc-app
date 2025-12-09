# 🚀 Quick Start - Bulk Import Feature

## What's New?

A **Bulk Import/Export** menu has been added to your textile shop application, allowing you to upload hundreds of products at once using Excel files.

## How to Access

1. **From Sidebar:** Click "Bulk Import" (📤 icon)
2. **From Home:** Click "Bulk Import" quick action card

## Quick Steps

### Step 1: Download Template
```
Click "Download Template" button
→ Opens Excel file with sample data
→ Shows all required columns
```

### Step 2: Fill Your Data
```
Required columns:
- Supplier Name
- Product Name  
- Retail Price
- Quantity

Optional columns:
- Supplier GST, Wholesale Price, Fabric Type, Pattern, Size, HSN Code, Barcode, Status
```

### Step 3: Upload File
```
Click "Choose Excel or CSV file"
→ Select your filled template
→ Click "Upload & Process"
→ Wait for completion
```

### Step 4: Check Results
```
✅ Success → All products added
⚠️ Partial → Some failed (check errors)
❌ Failed → All failed (fix and retry)

Download error report to see what went wrong
```

## File Example

| Supplier Name | Product Name  | Retail Price | Quantity |
|---------------|---------------|--------------|----------|
| ABC Textiles  | Cotton Fabric | 150          | 50       |
| XYZ Suppliers | Silk Thread   | 80           | 100      |

## Tips

✅ **DO:**
- Use the provided template
- Fill all required fields
- Check data before uploading
- Review error reports

❌ **DON'T:**
- Skip required columns
- Use invalid file formats
- Upload empty rows
- Forget to save Excel file

## Troubleshooting

**File won't upload?**
→ Make sure it's .xlsx, .xls, or .csv format

**All products fail?**
→ Check required fields are filled
→ Verify prices are numbers
→ Ensure quantity is a whole number

**Some products fail?**
→ Download error report
→ Fix the specific rows mentioned
→ Re-upload only those rows

## Need Help?

Check the detailed guide: `BULK_IMPORT_README.md`

---

**Feature Status:** ✅ Ready to Use
**Location:** Sidebar → Bulk Import
**Supported Files:** Excel (.xlsx, .xls), CSV (.csv)
