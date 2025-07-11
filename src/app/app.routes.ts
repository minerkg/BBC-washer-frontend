// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookableUnitsComponent } from './components/bookable-units/bookable-units.component'; // <--- Ensure this import is correct
import { MyReservationsComponent } from './components/my-reservations/my-reservations.component';
import { WasherManagementComponent } from './components/admin/washer-management/washer-management.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, children:[
    {path:'washers', component: BookableUnitsComponent},
    { path: 'my-reservations', component: MyReservationsComponent },
    { path: 'admin/washers', component: WasherManagementComponent },
    {path: 'my-profile', component: ProfileComponent}
  ]},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // IMPORTANT: We'll add route guards here later to protect routes
];
