import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FooterService } from './footer.service';

@Component({
  selector: 'app-footer',
  imports: [NgIf],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(public footer: FooterService){}
}
