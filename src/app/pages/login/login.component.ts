import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../components/navbar/navbar.service';
import { FooterService } from '../../components/footer/footer.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  showFullPageLoader: boolean = false;

  constructor(
    private navbar: NavbarService, 
    private footer: FooterService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.navbar.hide();
    this.footer.hide();
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    
    const credentials = {
      email: this.email,
      password: this.password
    };

    this.userService.login(credentials).subscribe({
      next: (response) => {
        const user = response.user;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(user));
        this.loading = false;
        this.showFullPageLoader = true;
        setTimeout(() => {
          if(user.role === 'admin'){
            this.navbar.show();
            this.footer.show();
            this.router.navigate(['/dashboard']);
          }
          else{
          this.navbar.show();
          this.footer.show();
          this.router.navigate(['/']);
          }
        }, 5000);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'There Is An Error While Login';
        this.loading = false;
      },
      complete: () => {
        if (!this.showFullPageLoader) {
          this.loading = false;
        }
      }
    });
  }
}
