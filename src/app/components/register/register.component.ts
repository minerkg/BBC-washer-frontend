// src/app/components/register/register.component.ts
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    FormsModule,
    ToastModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]
})
export class RegisterComponent {
  username!: string;
  password!: string;
  first_name!: string;
  last_name!: string;
  email!: string;
  phone_nr!: string;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) { }

  registerUser() {
    console.log('Attempting registration with:', this.username, this.email);
    const registrationData = {
      username: this.username,
      password: this.password,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone_nr: this.phone_nr
    };

    this.authService.register(registrationData).subscribe({
      next: (response: any) => { // <--- Explicitly type 'response' as any (or a specific DTO if you have one)
        console.log('Registration successful:', response);
        this.messageService.add({severity:'success', summary:'Success', detail:'Registration Successful! You can now log in.'});
        this.resetForm();
        this.router.navigate(['/login']);
      },
      error: (error: any) => { // <--- Explicitly type 'error' as any (or HttpErrorResponse)
        console.error('Registration failed:', error);
        let errorMessage = 'Registration failed. Please try again.';
        if (error.status === 409 && error.error && typeof error.error.body === 'string') {
          errorMessage = error.error.body;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.messageService.add({severity:'error', summary:'Error', detail: errorMessage});
      }
    });
  }

  resetForm() {
    this.username = '';
    this.password = '';
    this.first_name = '';
    this.last_name = '';
    this.email = '';
    this.phone_nr = '';
  }
}
