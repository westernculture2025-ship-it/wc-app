export interface Product {
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
  status: string; // 'Available', 'Out of Stock', 'Discontinued'
  createdAt?: Date;
  updatedAt?: Date;
}
