import { Component } from '@angular/core';
import { ContactHeroComponent } from './contact-hero/contact-hero.component';
import { ContactFormComponent } from './contact-form/contact-form.component';

@Component({
  selector: 'app-contact',
  imports: [ContactHeroComponent , ContactFormComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

}
