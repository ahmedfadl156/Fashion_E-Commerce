import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn() && this.authService.Admin()) {
      return true;
    }
    else if(this.authService.isLoggedIn() && !this.authService.Admin()){
      this.router.navigate(['/'])
    }
    else{
    this.router.navigate(['/login']);
    }
    return false;
  }
}