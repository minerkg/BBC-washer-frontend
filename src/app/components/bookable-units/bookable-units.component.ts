// src/app/components/bookable-units/bookable-units.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For ngIf, ngFor, date pipe
import { BookableUnitService } from '../../services/bookable-unit.service'; // Import the new service
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // CORRECTED IMPORT PATH

@Component({
  selector: 'app-bookable-units',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ToastModule,
    RouterModule
  ],
  templateUrl: './bookable-units.component.html',
  styleUrl: './bookable-units.component.css',
  providers: [MessageService] // Provide MessageService
})
export class BookableUnitsComponent implements OnInit {
  bookableUnits: any[] = [];
  currentUserId: number | null = null;

  constructor(
    private bookableUnitService: BookableUnitService,
    private messageService: MessageService,
    private authService: AuthService // AuthService is injected here
  ) { }

  ngOnInit(): void {
    // This part ensures loadAvailableBookableUnits() is called only when a role is available
    this.authService.currentUserRole.subscribe(role => {
      if (role) { // User is logged in (has any role)
        // IMPORTANT: In a real app, the ID should come from a secure token or /user/me endpoint.
        // Mocking IDs for now to proceed with functionality testing
        if (role === 'ADMIN') {
          this.currentUserId = 1; // Adjust if your admin ID is different
        } else if (role === 'USER') {
          this.currentUserId = 2; // Adjust if your normal user ID is different
        } else {
          this.currentUserId = null;
        }

        if (this.currentUserId) {
          console.log('BookableUnitsComponent: User is authenticated, loading units with ID:', this.currentUserId);
          this.loadAvailableBookableUnits();
        } else {
          this.messageService.add({severity:'warn', summary:'Warning', detail:'Could not determine user ID for booking. Please log in again.'});
        }
      } else {
        console.log('BookableUnitsComponent: User is not authenticated, cannot load units.');
        this.messageService.add({severity:'warn', summary:'Warning', detail:'Please log in to view bookable units.'});
      }
    });

  }

  loadAvailableBookableUnits(): void {
    this.bookableUnitService.getAllAvailableBookableUnits().subscribe({
      next: (response) => {
        if (response && response.body) {
          this.bookableUnits = response.body;
          console.log('Available Bookable Units:', this.bookableUnits);
          this.messageService.add({severity:'success', summary:'Success', detail:'Bookable units loaded successfully.'});
        } else {
          this.bookableUnits = [];
          this.messageService.add({severity:'info', summary:'Info', detail:'No bookable units found.'});
        }
      },
      error: (error) => {
        console.error('Error loading bookable units:', error);
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to load bookable units.'});
        // Handle unauthorized errors if necessary (e.g., redirect to login)
      }
    });
  }

  bookUnit(unitId: number): void {
    if (this.currentUserId === null) {
      this.messageService.add({severity:'warn', summary:'Warning', detail:'User ID not found for booking. Please log in.'});
      return;
    }

    this.bookableUnitService.makeReservation(unitId, this.currentUserId).subscribe({
      next: (response) => {
        if (response && response.body) {
          this.messageService.add({severity:'success', summary:'Success', detail:'Reservation booked successfully!'});
          console.log('Reservation successful:', response.body);
          this.loadAvailableBookableUnits(); // Reload units to reflect changes
        }
      },
      error: (error) => {
        console.error('Error booking unit:', error);
        let errorMessage = 'Failed to book reservation.';
        if (error.status === 409 && error.error && typeof error.error.body === 'string') {
          errorMessage = error.error.body;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.messageService.add({severity:'error', summary:'Error', detail: errorMessage});
      }
    });
  }
}
