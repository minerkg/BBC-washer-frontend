// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card'; // Import CardModule if using p-card
import { RouterModule, Router } from '@angular/router'; // For routerLink and programmatic navigation

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    CardModule,
    RouterModule // Added RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
// src/app/components/login/login.component.ts
// ... (imports) ...

export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) { }

  // Add ngOnInit to see if anything is triggering on component init
  ngOnInit(): void {
    console.log('LoginComponent initialized.');
  }

  logIn() {
    console.log('logIn() method called.'); // This should appear FIRST when you click the button
    console.log('Attempting login with:', this.username, this.password);
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful callback received!', response); // This should follow a successful request
        this.messageService.add({severity:'success', summary:'Success', detail:'Login Successful!'});
        this.username = '';
        this.password = '';
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed callback received:', error); // This should follow a failed request
        this.messageService.add({severity:'error', summary:'Error', detail: error});
        this.password = '';
      }
    });
  }
}
