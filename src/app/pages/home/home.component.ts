import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { ArrivalsComponent } from '../../components/arrivals/arrivals.component';
import { BrandsComponent } from '../../components/brands/brands.component';
import { OffersComponent } from '../../components/offers/offers.component';
import { TopsellersComponent } from '../../components/topsellers/topsellers.component';
import { NavbarService } from '../../components/navbar/navbar.service';
import { FooterService } from '../../components/footer/footer.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    ArrivalsComponent,
    BrandsComponent,
    OffersComponent,
    TopsellersComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private navbar: NavbarService , private footer: FooterService) {};
  ngOnInit(){
    this.navbar.show();
    this.footer.show();
  }
}
