import {Component, OnInit} from '@angular/core';
import {Button, ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {InputTextModule} from "primeng/inputtext";
import {CommonModule, NgIf} from "@angular/common";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {ToastModule} from "primeng/toast";
import {TooltipModule} from "primeng/tooltip";
import {RouterModule} from "@angular/router";
import {ProfileService} from "../../../services/profile.service";
import {ReservationService} from "../../../services/reservation.service";
import {User} from "../../../models/user.model";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-reservation-manager',
  standalone: true,
  imports: [
    Button,
    CardModule,
    ConfirmDialogModule,
    InputTextModule,
    NgIf,
    PrimeTemplate,
    ReactiveFormsModule,
    TableModule,
    TagModule,
    ToastModule,
    TooltipModule,
    CommonModule,
    TagModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    RouterModule,
    TooltipModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './reservation-manager.component.html',
  styleUrl: './reservation-manager.component.css',
  providers: [MessageService, ConfirmationService]
})
export class ReservationManagerComponent implements OnInit {

  reservations: any[] = [];
  currentUserId: number | null = null;
  isAdmin: boolean = false;

  displayEditDialog: boolean = false;

  constructor(
    private reservationService: ReservationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private profileService: ProfileService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.authService.currentUserRole.subscribe((role: string | null) => {
      if (role === 'ADMIN' || role === 'EMPLOYEE') {
        this.loadAllReservations();
      } else {

        this.messageService.add({
          severity: 'error',
          summary: 'Access Denied',
          detail: 'You do not have permission to manage washers.'
        });
      }
    });
    this.isAdmin = this.authService.hasRole('ADMIN');
  }

  // TODO: check why this does not work
  // ngOnInit(): void {
  //   const profile = this.profileService.getProfileFromLocalStorage();
  //   if (profile) {
  //     const user: User = JSON.parse(profile);
  //     this.currentUserId = user.id;
  //   } else {
  //     this.currentUserId = null;
  //     console.warn('No user profile found in local storage.');
  //   }
  //   this.loadAllReservations();
  // }


  loadAllReservations(): void {
    this.reservationService.getAllReservationsForAdmin().subscribe({
      next: (response) => {
        if (response && response.body) {
          this.reservations = response.body;
          console.log('My Reservations:', this.reservations);
        } else {
          this.reservations = [];
          this.messageService.add({severity: 'info', summary: 'Info', detail: 'You have no reservations.'});
        }
      },
      error: (error) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to load your reservations.'});
      }
    });
  }


  getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      case 'PENDING':
        return 'warning';
      case 'COMPLETED':
        return 'info';
      default:
        return 'secondary';
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
        this.messageService.add({severity: 'info', summary: 'Cancelled', detail: 'You have cancelled the operation.'});
      }
    });
  }

  cancelReservation(reservationId: number): void {
    this.reservationService.cancelReservation(reservationId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.body || 'Reservation cancelled successfully!'
        });
        console.log('Reservation cancelled:', response);
        this.loadAllReservations(); // Reload reservations to update status
      },
      error: (error) => {
        console.error('Error cancelling reservation:', error);
        let errorMessage = 'Failed to cancel reservation.';
        if (error.status === 409 && error.error && typeof error.error.body === 'string') {
          errorMessage = error.error.body; // e.g., "Reservation already cancelled."
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.messageService.add({severity: 'error', summary: 'Error', detail: errorMessage});
      }
    });
  }

  confirmComplete(reservationId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to mark this reservation as COMPLETE?',
      header: 'Complete Reservation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.completeReservation(reservationId);
      },
      reject: () => {
        this.messageService.add({severity: 'info', summary: 'Cancelled', detail: 'You have cancelled the operation.'});
      }
    });
  }

  completeReservation(reservationId: number): void {
    this.reservationService.changeReservationStatusToCompleted(reservationId).subscribe({
      next: (response) => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Reservation updated successfully!'});
        console.log('Reservation updated:', response.body);
        this.displayEditDialog = false;
        this.loadReservations();
      },
      error: (error) => {
        console.error('Error updating reservation:', error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to update reservation.'});
        if (error.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Access Denied',
            detail: 'You do not have permission to update reservations.'
          });
        }
      }
    });
  }

  loadReservations(): void {
    this.reservationService.getAllReservationsForAdmin().subscribe({
      next: (response) => {
        if (response && response.body) {
          this.reservations = response.body.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );
          console.log('All reservations:', this.reservations);
        } else {
          this.reservations = [];
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'No reservations found.'
          });
        }
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load reservations.'
        });
        if (error.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Access Denied',
            detail: 'You do not have permission to view reservations.'
          });
        }
      }
    });
  }

  reservationSearchQuery: string = '';

  get filteredReservations() {
    if (!this.reservationSearchQuery) {
      return this.reservations;
    }

    const query = this.reservationSearchQuery.toLowerCase();

    return this.reservations.filter(reservation =>
      reservation.bookableUnit?.washer?.name?.toLowerCase().includes(query) ||
      reservation.bookableUnit?.washer?.capacity?.toLowerCase().includes(query) ||
      reservation.bookableUnit?.timeSlot?.timeInterval?.date?.includes(query) ||
      reservation.bookableUnit?.timeSlot?.timeInterval?.startTime?.includes(query) ||
      reservation.bookableUnit?.timeSlot?.timeInterval?.endTime?.includes(query)
    );
  }

}
