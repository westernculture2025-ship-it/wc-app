import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  
  // Form fields for product
  product: Product = this.initProduct();
  editMode = false;
  editingId: number | null = null;
  searchQuery = '';
  loading = false;
  showModal = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Filter
  statusFilter = 'all'; // 'all', 'Available', 'Out of Stock', 'Discontinued'

  // Make Math available in template
  Math = Math;

  constructor(
    private apiService: ApiService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  initProduct(): Product {
    return {
      supplierName: '',
      supplierGstNumber: '',
      productName: '',
      wholesalePrice: 0,
      retailPrice: 0,
      fabricType: '',
      pattern: '',
      size: '',
      quantity: 0,
      hsnCode: '',
      barcode: '',
      status: 'Available'
    };
  }

  loadProducts(): void {
    this.loading = true;
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.updatePaginatedProducts();
        this.loading = false;
      },
      error: (error) => {
        // If API fails, load sample data
        console.warn('API not available, loading sample data');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.updatePaginatedProducts();
  }

  onSubmit(): void {
    if (this.editMode && this.editingId) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  openAddModal(): void {
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.product = { ...product };
    this.editMode = true;
    this.editingId = product.id || null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  createProduct(): void {
    this.loading = true;
    this.apiService.createProduct(this.product).subscribe({
      next: (data) => {
        this.products.push(data);
        this.updatePaginatedProducts();
        this.closeModal();
        this.loading = false;
        this.alertService.success('Product created successfully!');
      },
      error: (error) => {
        this.alertService.error('Failed to create product: ' + error.message);
        this.loading = false;
      }
    });
  }

  updateProduct(): void {
    if (!this.editingId) return;
    
    this.loading = true;
    this.apiService.updateProduct(this.editingId, this.product).subscribe({
      next: (data) => {
        const index = this.products.findIndex(p => p.id === this.editingId);
        if (index !== -1) {
          this.products[index] = data;
          this.updatePaginatedProducts();
        }
        this.closeModal();
        this.loading = false;
        this.alertService.success('Product updated successfully!');
      },
      error: (error) => {
        this.alertService.error('Failed to update product: ' + error.message);
        this.loading = false;
      }
    });
  }

  editProduct(product: Product): void {
    this.openEditModal(product);
  }

  deleteProduct(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this product?')) return;
    
    this.loading = true;
    this.apiService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.updatePaginatedProducts();
        this.loading = false;
        this.alertService.success('Product deleted successfully!');
      },
      error: (error) => {
        this.alertService.error('Failed to delete product: ' + error.message);
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.product = this.initProduct();
    this.editMode = false;
    this.editingId = null;
  }

  // Pagination methods
  updatePaginatedProducts(): void {
    this.filteredProducts = this.getFilteredProducts();
    this.totalItems = this.filteredProducts.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  getFilteredProducts(): Product[] {
    let filtered = [...this.products];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.productName.toLowerCase().includes(query) ||
        p.barcode.toLowerCase().includes(query) ||
        p.supplierName.toLowerCase().includes(query) ||
        p.supplierGstNumber.toLowerCase().includes(query) ||
        p.fabricType.toLowerCase().includes(query) ||
        p.hsnCode.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(p => (p.status || 'Available') === this.statusFilter);
    }

    return filtered;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedProducts();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePaginatedProducts();
  }

  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.updatePaginatedProducts();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}
