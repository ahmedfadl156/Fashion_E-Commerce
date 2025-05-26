import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-topsellers',
  imports: [RouterLink, RouterLinkActive, NgFor, CurrencyPipe, NgIf],
  templateUrl: './topsellers.component.html',
  styleUrl: './topsellers.component.scss'
})
export class TopsellersComponent {
  products: any[] = [];
  displayedProducts: any[] = [];
  isLoading = true;
  itemsToShow = 4;
  productsService: any;
  
  constructor(private Products: ProductsService, private router: Router) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.isLoading = true;
    this.Products.getAllProducts().subscribe({
      next: (data) => {
        this.products = Array.isArray(data) ? data : [];
        
        this.products.sort((a, b) => {
          const ratingA = parseFloat(a.rating) || 0;
          const ratingB = parseFloat(b.rating) || 0;
          return ratingB - ratingA;
        });
        
        this.displayedProducts = this.products.slice(0, this.itemsToShow);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  onSelectProduct(id: string){
    this.router.navigate(['/singleproduct', id]);
  }
  
  getStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(1); 
    }
    
    if (hasHalfStar) {
      stars.push(0.5); 
    }
    

    for (let i = 0; i < emptyStars; i++) {
      stars.push(0);
    }
    
    return stars;
  }
}
