import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { AllproductsComponent } from './allproducts/allproducts.component';

@Component({
  selector: 'app-shopnow',
  imports: [NavbarComponent , AllproductsComponent],
  templateUrl: './shopnow.component.html',
  styleUrl: './shopnow.component.scss'
})
export class ShopnowComponent {

}
