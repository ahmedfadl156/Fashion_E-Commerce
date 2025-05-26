import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { cartService } from '../../services/cart.service';
import { NavbarService } from './navbar.service';
import { NgIf, AsyncPipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, AsyncPipe, CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  isLoggedIn = false;
  username = '';
  
  constructor(
    public navbar: NavbarService,
    private userService: UserService,
    public cartService: cartService
  ) {}

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.username = user?.username || '';
    });
  }

  logout(): void {
    this.userService.logout();
  }
}

