import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { BarcodeScannerService } from '../../services/barcode-scanner.service';
import { Product } from '../../models/product.model';
import { Invoice, InvoiceItem } from '../../models/invoice.model';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: '0', opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('200ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})
export class BillingComponent implements OnInit, OnDestroy {
  cartItems: Map<number, InvoiceItem> = new Map();
  manualBarcode = '';
  customerId = 0;
  customerName = '';
  customerPhone = '';
  customerEmail = '';
  customerAddress = '';
  customerDob = '';
  customerDom = '';
  customerMaritalStatus = '';
  paymentMethod = 'cash';
  discount = 0;
  cgstRate = 2.5; // CGST 2.5%
  sgstRate = 2.5; // SGST 2.5%
  loading = false;
  isLoading = false;
  customerStatus = ''; // 'exists', 'not-exists', or empty
  canSave = false;
  showMoreCustomerDetails = false;
  showCartItems = true; // Controls cart items accordion
  currentDate = new Date(); // For bill receipt
  originalCustomerData = {
    name: '',
    email: '',
    dob: '',
    dom: '',
    address: '',
    maritalStatus: ''
  };
  invoice: any;
  private phoneInput$ = new Subject<string>();
  private barcodeInputTimeout: any; // For barcode scanner detection
  

  constructor(
    private apiService: ApiService,
    private barcodeScanner: BarcodeScannerService,
    private alertService: AlertService
  ) { 
    // Debounce user typing before making request
    this.phoneInput$.pipe(debounceTime(400)).subscribe(phone => {
      if (phone.length === 10) {
        this.fetchCustomerDetails(phone);
      }
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    // Component cleanup
    if (this.barcodeInputTimeout) {
      clearTimeout(this.barcodeInputTimeout);
    }
  }

  addProductByBarcode(barcode: string): void {
    this.loading = true;
    
    // Call API to get product by barcode
    this.apiService.getProductByBarcode(barcode).subscribe({
      next: (product) => {
        if (product && product.status) {
          this.addToCart(product);
          // Don't show alert for successful add to cart to avoid interruption during scanning
        } else {
          this.alertService.error(`Product not found or inactive for barcode: ${barcode}`);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching product:', error);
        this.alertService.error(`Product not found for barcode: ${barcode}`);
        this.loading = false;
      }
    });
  }

  addManualBarcode(): void {
    if (this.manualBarcode.trim()) {
      this.addProductByBarcode(this.manualBarcode.trim());
      this.manualBarcode = '';
    }
  }

  onBarcodeInput(): void {
    // Clear any existing timeout
    if (this.barcodeInputTimeout) {
      clearTimeout(this.barcodeInputTimeout);
    }

    // Barcode scanners typically send all characters very quickly (within 50-100ms)
    // and usually end with Enter key. We'll wait for input to stop for 200ms
    // before processing to ensure we have the complete barcode
    this.barcodeInputTimeout = setTimeout(() => {
      const trimmedBarcode = this.manualBarcode.trim();
      
      // Check if we have a valid barcode (at least 6 characters, alphanumeric)
      if (trimmedBarcode.length >= 6 && /^[A-Z0-9]+$/i.test(trimmedBarcode)) {
        // Automatically fetch product when barcode is scanned
        this.addManualBarcode();
      }
    }, 200); // Wait 200ms after last character input
  }

  addToCart(product: Product): void {
    const productId = product.id!;
    const availableStock = product.quantity || 0;
    
    if (this.cartItems.has(productId)) {
      const item = this.cartItems.get(productId)!;
      const newQuantity = item.quantity + 1;
      
      // Check if new quantity exceeds available stock
      if (newQuantity > availableStock) {
        this.alertService.warning(`Cannot add more! Only ${availableStock} units available in stock for ${product.productName}.`);
        return;
      }
      
      item.quantity = newQuantity;
      item.availableStock = availableStock; // Update available stock reference
      this.calculateItemTotal(item);
    } else {
      // Check if at least 1 unit is available
      if (availableStock < 1) {
        this.alertService.warning(`${product.productName} is out of stock!`);
        return;
      }
      
      this.cartItems.set(productId, {
        productId: productId,
        productName: product.productName,
        barcode: product.barcode,
        hsnCode: product.hsnCode,
        price: product.retailPrice,
        quantity: 1,
        subTotal: product.retailPrice,
        discountPercentage: 0,
        discountAmount: 0,
        total: product.retailPrice,
        availableStock: availableStock // Store available stock for later validation
      });
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    const item = this.cartItems.get(productId);
    if (item) {
      const availableStock = (item as any).availableStock || 0;
      
      // Check if quantity exceeds available stock
      if (quantity > availableStock) {
        this.alertService.warning(`Cannot update! Only ${availableStock} units available in stock for ${item.productName}.`);
        // Reset to available stock or current quantity (whichever is smaller)
        item.quantity = Math.min(item.quantity, availableStock);
        this.calculateItemTotal(item);
        return;
      }
      
      item.quantity = quantity;
      this.calculateItemTotal(item);
    }
  }

  updateDiscountPercent(productId: number, discountPercent: number): void {
    const item = this.cartItems.get(productId);
    if (item) {
      // Round to 2 decimal places and clamp between 0-100
      item.discountPercentage = Math.max(0, Math.min(100, discountPercent));
      this.calculateItemTotal(item);
    }
  }

  updateDiscountAmount(productId: number, discountAmount: number): void {
    const item = this.cartItems.get(productId);
    if (item) {
      const maxDiscount = item.quantity * item.price;
      // Round to 2 decimal places and clamp between 0 and line total
      item.discountAmount = Math.max(0, Math.min(maxDiscount, discountAmount));
      // Calculate discount percentage based on amount
      item.discountPercentage = maxDiscount > 0 ? (item.discountAmount / maxDiscount) * 100 : 0;
      this.calculateItemTotal(item);
    }
  }

  calculateItemTotal(item: InvoiceItem): void {
    const subtotal = item.quantity * item.price;
    
    // If discount percentage is set, calculate discount amount
    if (item.discountPercentage > 0) {
      item.discountAmount = (subtotal * item.discountPercentage) / 100;
    }
    
    // Ensure total never goes below 0
    item.total = Math.max(0, Math.round((subtotal - item.discountAmount) * 100) / 100);
  }

  removeFromCart(productId: number): void {
    this.cartItems.delete(productId);
  }

  getCartArray(): InvoiceItem[] {
    return Array.from(this.cartItems.values());
  }

  getTotalQuantity(): number {
    return this.getCartArray().reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.getCartArray().reduce((sum, item) => sum + (item.quantity * item.price), 0);
  }

  getCgstAmount(): number {
    const totalGstRate = this.cgstRate + this.sgstRate;
    const taxableValue = this.getTotalAmount() / (1 + totalGstRate / 100);
    return (taxableValue * this.cgstRate) / 100;
  }

  getSgstAmount(): number {
    const totalGstRate = this.cgstRate + this.sgstRate;
    const taxableValue = this.getTotalAmount() / (1 + totalGstRate / 100);
    return (taxableValue * this.sgstRate) / 100;
  }

  getTaxableAmount(): number {
    return parseFloat((this.getTotalAmount() - this.getCgstAmount() - this.getSgstAmount()).toFixed(2));
  }

  getDiscountAmount(): number {
    return this.getCartArray().reduce((sum, item) => sum + item.discountAmount, 0);
  }

  getTotalAmount(): number {
    return this.getSubtotal() - this.getDiscountAmount();
  }

  createInvoice(): void {
    if (this.cartItems.size === 0) {
      this.alertService.warning('Cart is empty. Add products to create an invoice.');
      return;
    }

    if (!this.customerPhone || this.customerPhone.trim() === '') {
      this.alertService.warning('Customer phone number is required.');
      return;
    }

    // Validate mandatory fields
    if (!this.customerName || this.customerName.trim() === '') {
      this.alertService.warning('Customer name is required.');
      return;
    }

    if (this.customerId === 0) {
      this.alertService.warning('Save Customer before creating an invoice.');
      return;
    }

    // Validate stock availability before creating invoice
    const stockIssues: string[] = [];
    this.getCartArray().forEach(item => {
      const availableStock = item.availableStock || 0;
      if (item.quantity > availableStock) {
        stockIssues.push(`${item.productName}: Requested ${item.quantity}, Available ${availableStock}`);
      }
    });

    if (stockIssues.length > 0) {
      this.alertService.error(`Cannot create invoice! Insufficient stock:\n${stockIssues.join('\n')}`);
      return;
    }

    const invoice: Invoice = {
      customerId: this.customerId,
      subtotal: this.getSubtotal(),
      discount: this.getDiscountAmount(),
      taxableAmount: this.getTaxableAmount(),
      cgstPercentage: this.cgstRate,
      cgst: this.getCgstAmount(),
      sgstPercentage: this.sgstRate,
      sgst: this.getSgstAmount(),
      total: this.getTotalAmount(),
      paymentMethod: this.paymentMethod,
      invoiceItems: this.getCartArray(),
    };

    this.loading = true;
    
    // Call API to create invoice
    this.apiService.createInvoice(invoice).subscribe({
      next: (createdInvoice) => {
        this.alertService.success(`Invoice #${createdInvoice.invoiceNumber} created successfully!`);
        console.log('Created Invoice:', createdInvoice);
        
        this.invoice = createdInvoice;
        // Print the simple bill receipt
        this.printBill();
        
        this.resetBilling();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating invoice:', error);
        this.alertService.error('Failed to create invoice. Please try again.');
        this.loading = false;
      }
    });
  }

  printBill(): void {
    if (!this.invoice) {
      this.alertService.error('Invoice data not available');
      return;
    }

    // Wait for Angular to render the bill component
    setTimeout(() => {
      // Get the bill component HTML
      const billElement = document.getElementById('billReceipt');
      
      if (!billElement) {
        this.alertService.error('Bill component not found');
        return;
      }

      // Clone the element to avoid modifying the original
      const billClone = billElement.cloneNode(true) as HTMLElement;
      
      // Remove the border styling for print
      billClone.style.border = 'none';
      billClone.style.margin = '0';
      billClone.style.padding = '10px';

      const billHTML = `
        <html>
          <head>
            <title>Bill Receipt</title>
            <style>
              @media print {
                body { margin: 0; }
                @page { size: 80mm auto; margin: 0; }
              }
              body { 
                font-family: 'Courier New', monospace; 
                font-size: 12px;
                width: 80mm;
                margin: 0 auto;
                padding: 0;
              }
            </style>
          </head>
          <body>
            ${billClone.innerHTML}
          </body>
        </html>
      `;

      // Open print window
      const printWindow = window.open('', '', 'height=600,width=400');
      if (!printWindow) {
        this.alertService.error('Please allow popups to print the bill');
        return;
      }

      printWindow.document.write(billHTML);
      printWindow.document.close();
      
      // Wait for content to load, then automatically trigger print
      printWindow.onload = () => {
        // Small delay to ensure rendering is complete
        setTimeout(() => {
          // Automatically trigger print dialog
          printWindow.print();
          
          // Close the window after printing (or if user cancels)
          // Check if print was successful using afterprint event
          printWindow.onafterprint = () => {
            printWindow.close();
          };
          
          // Fallback: close after 1 second if onafterprint doesn't fire
          setTimeout(() => {
            if (!printWindow.closed) {
              printWindow.close();
            }
          }, 1000);
        }, 250);
      };
    }, 100); // Wait for Angular to render the component
  }

  resetBilling(): void {
    this.cartItems.clear();
    this.customerId = 0;
    this.customerName = '';
    this.customerPhone = '';
    this.customerEmail = '';
    this.customerAddress = '';
    this.customerDob = '';
    this.customerDom = '';
    this.customerMaritalStatus = '';
    this.discount = 0;
    this.cgstRate = 2.5;
    this.sgstRate = 2.5;
    this.paymentMethod = 'cash';
  }

  clearCart(): void {
    if (this.cartItems.size === 0) {
      this.alertService.info('Cart is already empty.');
      return;
    }
    
    this.alertService.warning('Click OK to confirm clearing the cart.', 5000);
    
    // Small delay to let user see the warning before confirm
    setTimeout(() => {
      if (confirm('Are you sure you want to clear the cart?')) {
        this.cartItems.clear();
        this.alertService.success('Cart cleared successfully!');
      }
    }, 100);
  }

  onPhoneInput() {
    this.customerStatus = ''; // Reset status when user types
    this.phoneInput$.next(this.customerPhone);
  }

  fetchCustomerDetails(phoneNumber: string) {
    this.isLoading = true;
    this.customerStatus = '';

    this.apiService.getCustomerByPhone(phoneNumber).subscribe({
      next: (data: any) => {
        this.customerId = data.id;
        this.customerName = data.name || '';
        this.customerEmail = data.email || '';
        this.customerDob = data.dob || '';
        this.customerDom = data.dom || '';
        this.customerAddress = data.address || '';
        this.customerMaritalStatus = data.maritalStatus || '';
        this.isLoading = false;
        this.customerStatus = 'exists';
        this.originalCustomerData = {
          name: this.customerName,
          email: this.customerEmail,
          dob: this.customerDob,
          dom: this.customerDom,
          address: this.customerAddress,
          maritalStatus: this.customerMaritalStatus
        };
      },
      error: () => {
        this.customerId = 0;
        this.customerName = '';
        this.customerEmail = '';
        this.customerDob = '';
        this.customerDom = '';
        this.customerAddress = '';
        this.customerMaritalStatus = '';
        this.isLoading = false;
        this.customerStatus = 'not-exists';
        this.originalCustomerData = {
          name: '',
          email: '',
          dob: '',
          dom: '',
          address: '',
          maritalStatus: ''
        };
      }
    });
  }

   isCustomerDataChanged(): boolean {
    // For new customers, enable if name and phone are filled
    if (this.customerStatus === 'not-exists') {
      return this.customerName.trim() !== '' && this.customerPhone.trim() !== '';
    }
    
    // For existing customers, check if any field has changed
    if (this.customerStatus === 'exists') {
      return this.customerName !== this.originalCustomerData.name ||
             this.customerEmail !== this.originalCustomerData.email ||
             this.customerDob !== this.originalCustomerData.dob ||
             this.customerDom !== this.originalCustomerData.dom ||
             this.customerAddress !== this.originalCustomerData.address ||
             this.customerMaritalStatus !== this.originalCustomerData.maritalStatus;
    }
    
    // If status is not determined yet, disable button
    return false;
  }

  saveCustomer(): void {
    // Validate customer data
    if (!this.customerName || !this.customerPhone) {
      this.alertService.warning('Customer name and phone number are required.');
      return;
    }

    if (this.customerPhone.length !== 10) {
      this.alertService.warning('Phone number must be 10 digits.');
      return;
    }

    const customerData = {
      name: this.customerName,
      phoneNumber: this.customerPhone,
      email: this.customerEmail || undefined,
      address: this.customerAddress || undefined,
      dob: this.customerDob || undefined,
      dom: this.customerDom || undefined,
      maritalStatus: this.customerMaritalStatus || undefined
    };

    this.loading = true;

    this.apiService.saveCustomer(customerData).subscribe({
      next: (response) => {
        this.alertService.success('Customer details saved successfully!');
        this.customerStatus = 'exists';
        this.customerId = response.id;
        this.originalCustomerData = {
          name: this.customerName,
          email: this.customerEmail,
          dob: this.customerDob,
          dom: this.customerDom,
          address: this.customerAddress,
          maritalStatus: this.customerMaritalStatus
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error saving customer:', error);
        this.alertService.error('Failed to save customer details.');
        this.loading = false;
      }
    });
  }
}
