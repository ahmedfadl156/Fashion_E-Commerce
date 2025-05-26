import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  imports: [RouterModule, FormsModule, NgIf],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
    name = '';
    email = '';
    message = '';
    phone = '';
    isLoading = false;
    errorMessage = '';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    async onSendMessage() {
        if (!this.name || !this.email || !this.message || !this.phone) {
            this.errorMessage = 'Please fill in all fields';
            return;
        }

        if (this.name.length < 3 || this.name.length > 50) {
            this.errorMessage = 'Name must be between 3 and 50 characters';
            return;
        }

        if (this.email.length < 10 || this.email.length > 250) {
            this.errorMessage = 'Email must be between 10 and 250 characters';
            return;
        }

        if (this.message.length < 3 || this.message.length > 500) {
            this.errorMessage = 'Message must be between 3 and 500 characters';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        try {
            await new Promise(resolve => setTimeout(resolve, 4000));
            
            const response = await this.http.post('http://localhost:3000/messages/send', {
                name: this.name,
                email: this.email,
                message: this.message,
                phone: this.phone
            }).toPromise();

            this.name = '';
            this.email = '';
            this.message = '';
            this.phone = '';

            this.router.navigate(['/message-sent']);
        } catch (error) {
            this.errorMessage = 'Failed to send message. Please try again.';
            console.error('Error sending message:', error);
        } finally {
            this.isLoading = false;
        }
    }
}
