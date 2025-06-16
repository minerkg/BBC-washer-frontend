// src/app/navbar/navbar.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router'; // Import RouterModule for routerLink
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ButtonModule,
    RouterModule, // Added RouterModule
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  isAdmin: boolean = false;
  isLogedIn: boolean = false;

    constructor(
      private router: Router,
      private authService: AuthService // Inject AuthService
    ) {}


  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('ADMIN');
    this.isLogedIn = this.authService.isAuthenticated();
  }

  
  logout() {
    this.authService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  



}
