// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from "../../navbar/navbar.component"; // Import AuthService
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    RouterModule,
    NavbarComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  isAdmin: boolean = false;
  user!: User;

  constructor(
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    
    this.isAdmin = this.authService.hasRole('ADMIN');
    var user2 = localStorage.getItem('profile');
    if(user2){
      this.user = JSON.parse(user2);
    }
 
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
