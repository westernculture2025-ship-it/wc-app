import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Product } from '../../models/product.model';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-barcode-label',
  templateUrl: './barcode-label.component.html',
  styleUrls: ['./barcode-label.component.css']
})
export class BarcodeLabelComponent implements OnInit {
  // scanner UI/logic removed — this component only generates printable barcodes
  searchQuery = '';
  selectedProducts: Product[] = [];
  filteredProducts: Product[] = [];
  allProducts: Product[] = [];
  loading = false;
  productQuantities: number[] = []; // Track quantity for each selected product

  @ViewChildren('barcodeImage') barcodeImageEls!: QueryList<ElementRef<HTMLDivElement>>;
  private JsBarcode: any = null;

  appName = environment.appConfig.appName;
  logoUrl = environment.appConfig.logoUrl;

  constructor(
    private apiService: ApiService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    // Check if JsBarcode is available globally (from CDN)
    const globalJB = (window as any).JsBarcode;
    if (globalJB) {
      this.JsBarcode = globalJB;
    } else {
      this.JsBarcode = null;
    }
    
    // attempt to render any existing labels (if products were pre-selected)
    setTimeout(() => this.renderBarcodes(), 50);

    // if JsBarcode not found, try to inject CDN script automatically so barcodes render
    if (!this.JsBarcode) {
      const cdn = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js';
      const existing = document.querySelector(`script[src="${cdn}"]`);
      if (!existing) {
        const s = document.createElement('script');
        s.src = cdn;
        s.onload = () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.JsBarcode = (window as any).JsBarcode || null;
          setTimeout(() => this.renderBarcodes(), 100);
        };
        s.onerror = () => console.warn('Failed to load JsBarcode CDN');
        document.body.appendChild(s);
      }
    }
  }

  

  loadProducts(): void {
    this.loading = true;
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data.filter(p => p.status);
        this.filteredProducts = this.allProducts;
        this.loading = false;
      },
      error: (error) => {
        this.alertService.error('Failed to load products: ' + error.message);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredProducts = this.allProducts;
      return;
    }

    this.filteredProducts = this.allProducts.filter(p => 
      p.productName.toLowerCase().includes(query) ||
      p.barcode.toLowerCase().includes(query) ||
      p.hsnCode?.toLowerCase().includes(query) ||
      p.fabricType?.toLowerCase().includes(query)
    );
  }

  addToSelection(product: Product): void {
    if (!this.selectedProducts.find(p => p.id === product.id)) {
      this.selectedProducts.push(product);
      this.productQuantities.push(1); // Default quantity is 1
      // render barcode for the newly added product after DOM updates
      setTimeout(() => this.renderBarcodes(), 50);
    }
  }

  removeFromSelection(productId: number): void {
    const index = this.selectedProducts.findIndex(p => p.id === productId);
    if (index > -1) {
      this.selectedProducts.splice(index, 1);
      this.productQuantities.splice(index, 1);
    }
    setTimeout(() => this.renderBarcodes(), 50);
  }

  clearSelection(): void {
    this.selectedProducts = [];
    this.productQuantities = [];
    setTimeout(() => this.renderBarcodes(), 50);
  }

  updateQuantity(index: number): void {
    // Ensure quantity is at least 1
    if (this.productQuantities[index] < 1) {
      this.productQuantities[index] = 1;
    }
  }

  getTotalLabels(): number {
    return this.productQuantities.reduce((sum, qty) => sum + qty, 0);
  }

  printLabels(): void {
    // Print labels as images: render each label to a PNG and print those images.
    this.printLabelsAsImages();
  }

  private async loadHtml2Canvas(): Promise<any> {
    // try window
    if ((window as any).html2canvas) return (window as any).html2canvas;
    // try to inject CDN
    const cdn = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    const existing = document.querySelector(`script[src="${cdn}"]`);
    if (!existing) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script');
        s.src = cdn;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load html2canvas'));
        document.body.appendChild(s);
      }).catch((e) => { console.warn(e); });
    }
    return (window as any).html2canvas;
  }

private buildTempLabel(product: any): HTMLElement {

  const template = document.querySelector('#label-template .barcode-label') as HTMLElement;
  if (!template) return document.createElement('div');

  // Clone the REAL HTML (maintains layout)
  const clone = template.cloneNode(true) as HTMLElement;

  // Store name
  const storeName = clone.querySelector('.store-name');
  if (storeName) storeName.textContent = this.appName || 'Western Culture';

  // Product title (uppercase)
  const title = clone.querySelector('.label-title');
  if (title) {
    title.textContent = product.productName.toUpperCase();
  }

  // Barcode div (JsBarcode target)
  const bw = clone.querySelector('.barcode-image') as HTMLElement;
  if (bw) {
    bw.innerHTML = '';  
    bw.setAttribute('data-barcode', product.barcode);
  }

  // Product size (right side of barcode)
  const productSize = clone.querySelector('.product-size');
  if (productSize) productSize.textContent = product.size;

  // Barcode text under the image - barcode number and price
  const barcodeNumber = clone.querySelector('.barcode-number');
  if (barcodeNumber) barcodeNumber.textContent = product.barcode;
  
  const barcodePrice = clone.querySelector('.barcode-price');
  if (barcodePrice) barcodePrice.textContent = `Rs.${product.retailPrice}`;

  return clone;
}

  private async renderElementToDataUrl(el: HTMLElement): Promise<string | null> {
    try {
      const html2canvas = await this.loadHtml2Canvas();
      if (!html2canvas) throw new Error('html2canvas not available');

      // If JsBarcode available, render svg inside .barcode-image
      const bwEls = el.querySelectorAll('.barcode-image');
      bwEls.forEach((bw: Element) => {
        const code = bw.getAttribute('data-barcode') || '';
        if (this.JsBarcode) {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          svg.setAttribute('width', '100');
          svg.setAttribute('height', '30');
          bw.appendChild(svg);
          try { this.JsBarcode(svg, code, { format: 'CODE128', width: 1, height: 25, displayValue: false, margin: 1 }); }
          catch { bw.textContent = code; }
        } else {
          // show numeric fallback
          bw.textContent = code;
        }
      });

      // html2canvas options: increase scale for quality
      const canvas = await (window as any).html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      return canvas.toDataURL('image/png');
    } catch (e) {
      console.warn('renderElementToDataUrl error', e);
      return null;
    }
  }

  private async printLabelsAsImages(): Promise<void> {
    if (!this.selectedProducts || this.selectedProducts.length === 0) {
      this.alertService.error('No products selected to print');
      return;
    }

    const images: string[] = [];
    for (let i = 0; i < this.selectedProducts.length; i++) {
      const p = this.selectedProducts[i];
      const qty = this.productQuantities[i] || 1;
      
      for (let j = 0; j < qty; j++) {
        const temp = this.buildTempLabel(p);
        // keep hidden but attached so CSS applies
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        document.body.appendChild(temp);
        const dataUrl = await this.renderElementToDataUrl(temp);
        document.body.removeChild(temp);
        if (dataUrl) images.push(dataUrl);
      }
    }

    if (images.length === 0) {
      this.alertService.error('Failed to generate label images.');
      return;
    }

    // Open print window with images in 2-column grid layout
    const w = window.open('', '_blank');
    if (!w) { 
      this.alertService.error('Failed to open print window (popup blocked)'); 
      return; 
    }
    
    // Build HTML with 2-column grid layout - all labels on single page
    w.document.write(`
      <html>
      <head>
        <title>Print Labels</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            margin: 0;
            padding: 5mm;
            background: white;
          }
          .label-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 3mm;
            width: 100%;
            max-width: 210mm;
          }
          .label-cell {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 2mm;
          }
          .label-cell img {
            width: 100%;
            height: auto;
            display: block;
          }
          @media print {
            body { padding: 3mm; }
            .label-cell { border: none; }
            @page { 
              size: A4;
              margin: 5mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="label-grid">
    `);
    
    images.forEach((src) => {
      w.document.write(`<div class="label-cell"><img src="${src}" /></div>`);
    });
    
    w.document.write(`
        </div>
      </body>
      </html>
    `);
    w.document.close();
    
    // Wait for images to load then print
    w.onload = () => setTimeout(() => { w.focus(); w.print(); }, 500);
  }
  
  private renderBarcodes(): void {
    // iterate through each barcode container and render an SVG with the product code
    this.barcodeImageEls.forEach((elRef) => {
      const el = elRef.nativeElement;
      const code = el.getAttribute('data-barcode') || '';
      // clear existing content
      el.innerHTML = '';
      if (this.JsBarcode) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100');
        svg.setAttribute('height', '30');
        el.appendChild(svg);
        try {
          this.JsBarcode(svg, code, { format: 'CODE128', width: 1, height: 25, displayValue: false, margin: 1 });
        } catch (err) {
          // if barcode rendering fails, show the code as fallback
          el.removeChild(svg);
          el.textContent = code;
          console.warn('Failed to render barcode for', code, err);
        }
      } else {
        // JsBarcode not available — show the raw code so user can at least see it
        el.textContent = code;
      }
    });
  }
}
