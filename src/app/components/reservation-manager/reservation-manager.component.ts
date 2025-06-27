// src/app/components/reservation-manager/reservation-manager.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { CardModule } from "primeng/card";
import { MessageModule } from 'primeng/message';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-reservation-manager',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ToastModule, ConfirmDialogModule, ButtonModule,
    InputTextModule, DropdownModule, CalendarModule, TagModule, CardModule, MessageModule
  ],
  templateUrl: './reservation-manager.component.html',
  styleUrls: ['./reservation-manager.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ReservationManagerComponent implements OnInit {

  masterReservations: any[] = [];
  searchQuery: string = '';
  selectedDate: Date = new Date();
  isAllowed: boolean = false;

  statusOptions = [
    { label: 'Cancelled', value: 'CANCELLED' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Pending', value: 'PENDING' }
  ];

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.isAllowed = this.authService.hasRole('ADMIN') || this.authService.hasRole('EMPLOYEE');
    if (this.isAllowed) {
      this.loadAllReservations();
    }
  }

  loadAllReservations(): void {
    this.reservationService.getAllReservationsForAdmin().subscribe({
      next: (response: HttpResponse<any>) => {
        this.masterReservations = response.body?.body || [];
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load reservations.' });
      }
    });
  }

  // MODIFICARE: Funcția lipsă a fost adăugată aici
  onDateChange(): void {
    // Nu este necesară nicio acțiune specifică aici.
    // Modificarea datei prin [(ngModel)] este suficientă pentru a declanșa
    // re-evaluarea getter-ului `displayedReservations`.
  }

  confirmUpdateStatus(reservation: any, newStatus: string): void {
    if (!newStatus || reservation.status === newStatus) {
      setTimeout(() => {
        const originalReservation = this.masterReservations.find(r => r.id === reservation.id);
        if (originalReservation) {
          reservation.status = originalReservation.status;
        }
      }, 0);
      return;
    }

    if (newStatus === 'CANCELLED') {
      this.confirmCancel(reservation.id);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Not Implemented',
        detail: `Changing status to '${newStatus}' is not supported yet.`
      });
    }
  }

  confirmCancel(reservationId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel this reservation?',
      header: 'Cancel Reservation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cancelReservation(reservationId);
      }
    });
  }

  cancelReservation(reservationId: number): void {
    this.reservationService.cancelReservation(reservationId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reservation has been cancelled.' });
        this.loadAllReservations();
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Cancellation Failed', detail: err.error?.body || 'Could not cancel the reservation.' });
      }
    });
  }

  // ... restul funcțiilor (displayedReservations, formatDate, getSeverity) ...
  get displayedReservations() {
    let filteredList = this.masterReservations;
    const dateString = this.formatDate(this.selectedDate);
    filteredList = filteredList.filter(res => res.bookableUnit?.timeSlot?.timeInterval?.date === dateString);
    const query = this.searchQuery?.trim().toLowerCase();
    if (query) {
      filteredList = filteredList.filter(res =>
        (res.user?.username?.toLowerCase().includes(query)) ||
        (res.bookableUnit?.washer?.name?.toLowerCase().includes(query)) ||
        (res.status?.toLowerCase().includes(query))
      );
    }
    return filteredList;
  }
  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  getSeverity(status: string): 'success' | 'info' | 'danger' | 'warning' {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'COMPLETED': return 'info';
      case 'CANCELLED': return 'danger';
      case 'PENDING': return 'warning';
      default: return 'success';
    }
  }
}
