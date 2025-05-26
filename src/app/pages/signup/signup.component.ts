import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarService } from '../../components/navbar/navbar.service';
import { FooterService } from '../../components/footer/footer.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  email: string = '';
  password: string = '';
  name: string = '';
  errorMessage: string = '';
  loading: boolean = false;


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
    
    const user = {
      username: this.name,
      email: this.email,
      password: this.password
    };

    this.userService.register(user).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Account Created Succesfully!',
          text: 'You Will Be Redirected To The Login Page....',
          icon: 'success',
          confirmButtonText: 'Okay'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        this.loading = false;
          Swal.fire({
          title: 'Error!',
          text: 'Error Occured While Signup Fill All Inputs!',
          icon: 'error',
          confirmButtonText: 'Okay'
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
