// src/app/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router'; // Import RouterModule for routerLink

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ButtonModule,
    RouterModule // Added RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // No more visible property or dialog-related methods here
}
