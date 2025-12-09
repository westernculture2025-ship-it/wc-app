export interface InvoiceItem {
  productId: number;
  productName: string;
  barcode: string;
  hsnCode: string;
  price: number;
  quantity: number;
  subTotal: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  availableStock?: number; // Optional field to track stock availability
}


export interface Invoice {
  id?: number;
  invoiceNumber?: string;
  customerId: number;
  customerName?: string;
  customerPhone?: string;
  customer?: {
    name?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
  };
  subtotal: number;
  discount?: number;
  taxableAmount: number;
  cgstPercentage?: number;
  cgst?: number;
  sgstPercentage?: number;
  sgst?: number;
  total: number;
  paymentMethod?: string;
  createdAt?: Date;
  invoiceItems: InvoiceItem[];
}

