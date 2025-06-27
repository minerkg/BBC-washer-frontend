import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router, RouterModule } from '@angular/router';
import { RouteTrackingService } from '../../services/route-tracking.service';

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

  @Input() inDialog: boolean = false;
  @Output() cancelDialog = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private routeTracker: RouteTrackingService
  ) {
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

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
      next: (response: any) => {
        console.log('Registration successful:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registration Successful! You can now log in.'
        });
        this.resetForm();
      },
      error: (error: any) => {
        console.error('Registration failed:', error);
        let errorMessage = 'Registration failed. Please try again.';
        if (error.status === 409 && error.error && typeof error.error.body === 'string') {
          errorMessage = error.error.body;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.messageService.add({severity: 'error', summary: 'Error', detail: errorMessage});
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

  cancel() {
    if (this.inDialog) {
      this.cancelDialog.emit();
    } else {
      const fallbackRoute = '/dashboard';
      const target = this.routeTracker.lastRoute || fallbackRoute;
      this.router.navigateByUrl(target);
    }
  }
}
