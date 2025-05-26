import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductsService } from '../../services/products.service';
import { cartService } from '../../services/cart.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-arrivals',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './arrivals.component.html',
  styleUrl: './arrivals.component.scss'
})
export class ArrivalsComponent implements OnInit {
  products: any[] = [];
  displayedProducts: any[] = [];
  isLoading = true;
  itemsToShow = 12;

  constructor(private productsService: ProductsService , private cartService: cartService , private router: Router) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.isLoading = true;
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.products = Array.isArray(data) ? data : [];
        
        this.products.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        
        this.displayedProducts = this.products.slice(0, this.itemsToShow);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  loadMore(){
    this.itemsToShow += 8;
    this.displayedProducts = this.products.slice(0 , this.itemsToShow);
  }

  onSelectProduct(id: string){
    this.router.navigate(['/singleproduct', id]);
  }
  
  isNewProduct(product: any): boolean {
    if (!product.createdAt) return false;
    
    const productDate = new Date(product.createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - productDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 7;
  }
}