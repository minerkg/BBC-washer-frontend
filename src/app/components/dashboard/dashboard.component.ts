// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to role changes from AuthService
    this.authService.currentUserRole.subscribe(role => {
      this.isAdmin = (role === 'ADMIN');
      console.log('DEBUG DashboardComponent: Role changed:', role, 'isAdmin set to:', this.isAdmin); // <--- ADDED DEBUG LOG
    });

    // Also check on init, in case role is already set (e.g., page refresh)
    this.isAdmin = this.authService.hasRole('ADMIN');
    console.log('DEBUG DashboardComponent: OnInit check, isAdmin:', this.isAdmin); // <--- ADDED DEBUG LOG
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
