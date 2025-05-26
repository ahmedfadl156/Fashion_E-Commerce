import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  availableQuantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class cartService {
  private itemcount = new BehaviorSubject<number>(0);
  itemcount$ = this.itemcount.asObservable();

  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      this.cartItems.next(items);
      this.updateItemCount();
    }
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }

  private updateItemCount(): void {
    const count = this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
    this.itemcount.next(count);
  }


  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  addtocart(product: any): boolean {
    if (!product) return false;
    
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.id === product._id);
    
    if (existingItem) {
      return false;
    } else {
      const newItem: CartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        availableQuantity: product.quantity || 0
      };
      
      console.log('Adding product to cart with available quantity:', newItem.availableQuantity);
      
      this.cartItems.next([...currentItems, newItem]);
      this.updateItemCount();
      this.saveCart();
      return true;
    }
  }

  updateCartItem(item: CartItem): Observable<boolean> {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.map(cartItem => {
      if (cartItem.id === item.id) {
        return item;
      }
      return cartItem;
    });
    
    this.cartItems.next(updatedItems);
    this.updateItemCount();
    this.saveCart();
    
    return new Observable<boolean>(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  removeFromCart(productId: string): Observable<boolean> {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.id !== productId);
    
    this.cartItems.next(updatedItems);
    this.updateItemCount();
    this.saveCart();
    
    return new Observable<boolean>(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) return;
    
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.map(item => {
      if (item.id === productId) {
        if (quantity > item.availableQuantity) {
          console.warn(`Requested quantity (${quantity}) exceeds available stock (${item.availableQuantity})`);
          return { ...item, quantity: item.availableQuantity };
        }
        return { ...item, quantity };
      }
      return item;
    });
    
    this.cartItems.next(updatedItems);
    this.updateItemCount();
    this.saveCart();
  }

  clearCart(): Observable<boolean> {
    this.cartItems.next([]);
    this.itemcount.next(0);
    localStorage.removeItem('cart');
    
    return new Observable<boolean>(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}