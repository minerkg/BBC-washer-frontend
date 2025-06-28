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

  constructor(
    private reservationService: ReservationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private profileService: ProfileService
  ) {
  }

  ngOnInit(): void {
    const user: User = JSON.parse(this.profileService.getProfileFromLocalStorage()!);
    this.currentUserId = user.id;
    this.loadAllReservations();
  }

  loadAllReservations(): void {
    this.reservationService.getAllReservationsForAdmin().subscribe({
      next: (response) => {
        if (response && response.body) {
          this.reservations = response.body;
          console.log('My Reservations:', this.reservations);
          //TODO: remove
          // this.messageService.add({severity:'success', summary:'Success', detail:'Your reservations loaded successfully.'});
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
