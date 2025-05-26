import { Component, ElementRef, ViewChild } from '@angular/core';
import { cartService, CartItem } from '../../services/cart.service';
import { CurrencyPipe, NgFor, DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import { ProductsService } from '../../services/products.service';
import { UserService } from '../../services/user.service';

interface Order {
  orderNumber: string;
  orderDate: Date;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
  };
  payment: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  totalafterdisc: number;
}

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, NgFor, FormsModule, SweetAlert2Module, DatePipe, NgIf],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  @ViewChild('invoiceSection') invoiceSection!: ElementRef;
  cartitems: CartItem[] = [];
  fullName?: string;
  streetAddress?: string;
  Town?: string;
  phone?: string;
  email?: string;
  isComplete = false;
  order?: Order;
  orderButton = false;
  isProcessing = false;
  cuponApplied = false;
  code = ["FinishedDepiProject2025","AhmedFadl2025"];
  codeinputtext: string = '';
  discountAmount: number = 100;
  appliedCupon!: string;
  constructor(
    private cart: cartService,
    private productsService: ProductsService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.cart.cartItems$.subscribe(items => {
      this.cartitems = items;
    });
  }

  onCheckout() {
    const total = this.cart.getCartTotal();
    const aftercupon = total - this.discountAmount;
    return {
      total: total,
      aftercupon: aftercupon
    };
  }

  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  onSubmitOrder() {
    if (this.isProcessing) return; 

    if(this.userService.isLoggedIn() === false){
      Swal.fire({
        title: "Error!",
        text: "Please Login First To continue Checkout",
        icon: 'error'
      });
      return;
    }
    if (!this.fullName || !this.streetAddress || !this.Town || !this.phone || !this.email) {
      this.isComplete = false;
      Swal.fire({
        title: "Error With Inputs",
        text: "Please Fill All Information!",
        icon: "error"
      });
      return;
    }

    if(this.cartitems.length === 0){
      Swal.fire({
        title: "Error With Products",
        text: "You Must Add At Least One Product To Continue CheckOut!",
        icon: "error"
      });
      return;
    }

    for (const item of this.cartitems) {
      if (item.quantity > item.availableQuantity) {
        Swal.fire({
          title: "Insufficient Stock",
          text: `The product "${item.name}" has only ${item.availableQuantity} available but you requested ${item.quantity}. Please update your cart.`,
          icon: "error"
        });
        this.isProcessing = false;
        return;
      }
    }

    this.isProcessing = true; 

    const productsToUpdate = this.cartitems.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));

    this.order = {
      orderNumber: `ORD-${this.generateOrderRandomNumber()}`,
      orderDate: new Date(),
      customer: {
        name: this.fullName,
        email: this.email,
        phone: this.phone
      },
      shippingAddress: {
        address: this.streetAddress,
        city: this.Town
      },
      payment: 'Cash On Delivery',
      items: this.cartitems,
      subtotal: this.onCheckout().total,
      shippingFee: 0,
      total: this.onCheckout().total,
      totalafterdisc: this.onCheckout().aftercupon
    };

    setTimeout(() => {
      this.productsService.updateProductsQuantities(productsToUpdate).subscribe({
        next: (response) => {
          console.log('Product quantities updated successfully:', response);
          
          this.isComplete = true;
          this.orderButton = true;
          
          Swal.fire({
            title: "Success",
            text: "Your Order Placed Successfully We Will Contact You Soon",
            icon: "success"
          });
          
          this.cart.clearCart();
          this.resetForm();
          this.isProcessing = false;
        },
        error: (error) => {
          console.error('Error updating product quantities:', error);
          
          Swal.fire({
            title: "Order Error",
            text: "There was a problem processing your order. Please try again.",
            icon: "error"
          });
          
          this.isProcessing = false;
        }
      });
    }, 4000); 
  }

  resetForm() {
    this.fullName = "";
    this.streetAddress = "";
    this.Town = "";
    this.phone = "";
    this.email = "";
  }

  generateOrderRandomNumber() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  getOrderDate() {
    return new Date();
  }

  getOrderInformation(){
    return this.fullName;
  }

  async downloadInvoice() {
    try {
      const element = this.invoiceSection.nativeElement;
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: '#ffffff'
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `invoice-${this.order?.orderNumber}.png`;
      link.click();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to generate invoice. Please try again.",
        icon: "error"
      });
    }
  }

  cuponCode(){
    if(this.codeinputtext === ""){
      Swal.fire({
        title: "Error",
        text: "Please Enter A Cupon",
        icon: "error"
      })
    }
    else if(this.codeinputtext === this.code[0] || this.codeinputtext === this.code[1]){
      this.cuponApplied = true;
      this.appliedCupon = this.codeinputtext;
      Swal.fire({
        title: "Succes",
        text: "Cupon Applied Succesfully",
        icon: "success"
      })
      this.codeinputtext = "";
    }
    else{
      Swal.fire({
        title: "Error",
        text: "Invalid Cupon",
        icon: "error"
      })
    }
  }
}
