// src/app/components/my-reservations/my-reservations.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation.service'; // Import the new service
import { TagModule } from 'primeng/tag'; // For p-tag
import { TableModule } from 'primeng/table'; // For p-table
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api'; // Import ConfirmationService
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // Import ConfirmDialogModule
import { RouterModule } from '@angular/router'; // If needed for links
import { ProfileService } from '../../services/profile.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [
    CommonModule,
    TagModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule, // Add ConfirmDialogModule
    RouterModule
  ],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.css',
  providers: [MessageService, ConfirmationService] // Provide MessageService and ConfirmationService
})
export class MyReservationsComponent implements OnInit {
  reservations: any[] = [];
  currentUserId: number | null = null; // Still needs to be dynamically obtained

  constructor(
    private reservationService: ReservationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService, // Inject ConfirmationService
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    var user: User = JSON.parse(this.profileService.getProfileFromLocalStorage()!);
    this.currentUserId = user.id; 

    this.loadMyReservations();
  }

  loadMyReservations(): void {
    this.reservationService.getAllReservationsByUser(this.currentUserId!).subscribe({
      next: (response) => {
        if (response && response.body) {
          this.reservations = response.body;
          console.log('My Reservations:', this.reservations);
          this.messageService.add({severity:'success', summary:'Success', detail:'Your reservations loaded successfully.'});
        } else {
          this.reservations = [];
          this.messageService.add({severity:'info', summary:'Info', detail:'You have no reservations.'});
        }
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to load your reservations.'});
      }
    });
  }

  getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'CANCELLED': return 'danger';
      case 'PENDING': return 'warning';
      case 'COMPLETED': return 'info';
      default: return 'secondary'; // Or choose another default like 'contrast'
    }
  }

  confirmCancel(reservationId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel this reservation?',
      header: 'Cancel Reservation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cancelReservation(reservationId);
      },
      reject: () => {
        this.messageService.add({severity:'info', summary:'Cancelled', detail:'You have cancelled the operation.'});
      }
    });
  }

  cancelReservation(reservationId: number): void {
    this.reservationService.cancelReservation(reservationId).subscribe({
      next: (response) => {
        this.messageService.add({severity:'success', summary:'Success', detail: response.body || 'Reservation cancelled successfully!'});
        console.log('Reservation cancelled:', response);
        this.loadMyReservations(); // Reload reservations to update status
      },
      error: (error) => {
        console.error('Error cancelling reservation:', error);
        let errorMessage = 'Failed to cancel reservation.';
        if (error.status === 409 && error.error && typeof error.error.body === 'string') {
          errorMessage = error.error.body; // e.g., "Reservation already cancelled."
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.messageService.add({severity:'error', summary:'Error', detail: errorMessage});
      }
    });
  }
}
