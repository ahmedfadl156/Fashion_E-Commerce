import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cartService, CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  products: any[] = [];
  displayedProducts: any[] = [];
  maxqyt = false;
  insufficientStock = false;
  productWithError = '';
  constructor(
    public cartService: cartService,
    private Products: ProductsService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
    this.fetchProducts();
  }

  fetchProducts() {
    this.Products.getAllProducts().subscribe({
      next: (data: any[]) => {
        console.log('Fetched Products:', data);
        this.products = data;
        
        this.updateCartItemsAvailability();
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }
  
  updateCartItemsAvailability() {
    this.cartItems.forEach(cartItem => {
      const product = this.products.find(p => p._id === cartItem.id);
      if (product) {
        cartItem.availableQuantity = product.quantity || 0;
      }
    });
  }
  
  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe(() => {
    });
  }
  
  updateQuantity(item: CartItem, newQuantity: number | string): void {
    const quantity = typeof newQuantity === 'string' ? parseInt(newQuantity, 10) : newQuantity;
    if (isNaN(quantity) || quantity < 1) return;
    
    if (quantity > item.availableQuantity) {
      this.insufficientStock = true;
      this.productWithError = item.name;
      this.maxqyt = false;
      setTimeout(() => {
        this.insufficientStock = false;
      }, 3000);
      return;
    }
    
    if (quantity > 10) {
      this.maxqyt = true;
      this.insufficientStock = false;
      setTimeout(() => {
        this.maxqyt = false;
      }, 3000);
      return;
    }
    
    this.cartService.updateQuantity(item.id, quantity);
  }
  
  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }
  
  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }
  
  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
  
  continueShopping(): void {
    this.router.navigate(['/allproducts']);
  }
}
