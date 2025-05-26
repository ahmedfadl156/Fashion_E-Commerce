import { Component } from '@angular/core';
import { AboutHeroComponent } from './components/about-hero/about-hero.component';
import { AboutOffersComponent } from './components/about-offers/about-offers.component';
import { AboutTeamComponent } from './components/about-team/about-team.component';
import { AboutTestimonialsComponent } from './components/about-testimonials/about-testimonials.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    AboutHeroComponent,
    AboutOffersComponent,
    AboutTeamComponent,
    AboutTestimonialsComponent
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {}
