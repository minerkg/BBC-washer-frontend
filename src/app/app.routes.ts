// src/app/app.routes.ts
import {Routes} from '@angular/router';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {BookableUnitsComponent} from './components/bookable-units/bookable-units.component';
import {MyReservationsComponent} from './components/my-reservations/my-reservations.component';
import {WasherManagementComponent} from './components/admin/washer-management/washer-management.component';
import {ProfileComponent} from './components/profile/profile.component';
import {UserManagerComponent} from './components/admin/user-manager/user-manager.component';
import {ReservationManagerComponent} from './components/reservation-manager/reservation-manager.component';
import {LandingPageComponent} from "./components/landing-page/landing-page.component";
import {WelcomeComponent} from "./components/welcome/welcome.component";

export const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: 'welcome', component: WelcomeComponent },
      {path: 'washers', component: BookableUnitsComponent},
      {path: 'my-profile', component: ProfileComponent},
      {path: 'my-reservations', component: MyReservationsComponent},
      {path: 'admin/washers', component: WasherManagementComponent},
      {path: 'admin/user-manager', component: UserManagerComponent},
      {path: 'admin/reservation-manager', component: ReservationManagerComponent},

    ]
  },
  {path: '', redirectTo: '/login', pathMatch: 'full'},
];
