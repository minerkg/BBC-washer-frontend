import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookableUnitService } from '../../services/bookable-unit.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MenuItem, MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { StepsModule } from 'primeng/steps';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { BookableUnitDTO } from '../../models/dtos/bookableUnit.model';
import { ProfileService } from '../../services/profile.service';
import { User } from '../../models/user.model';
import { ReservationService } from '../../services/reservation.service';
import { TimeSlot } from '../../models/dtos/timeSlot.model';

@Component({
  selector: 'app-bookable-units',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ToastModule,
    RouterModule,
    CalendarModule,
    FormsModule,
    DropdownModule,
    StepsModule,
  ],
  templateUrl: './bookable-units.component.html',
  styleUrl: './bookable-units.component.css',
  providers: [MessageService],
})
export class BookableUnitsComponent implements OnInit {
  steps: MenuItem[] = [
    { label: 'Select Date' },
    { label: 'Select Time Slot' },
    { label: 'Summary' },
  ];
  activeStep: number = 0;
  userId: number | undefined;
  bookableUnits: BookableUnitDTO[] = [];
  selectedDate: Date | null = null;
  minDate: Date = new Date(); // Today
  maxDate: Date = new Date(new Date().setDate(new Date().getDate() + 7)); // One week from now

  availableTimeSlots: {
    label: string; // "08:00 - 08:30"
    value: number; // bookableUnit.id
  }[] = [];
  userLoggedIn: User | null;

  selectedTimeSlot: TimeSlot | undefined;
  selectedBookableUnitId: number | null = null;
  noDataMessage: string | null = null;

  constructor(
    private bookableUnitService: BookableUnitService,
    private profileService: ProfileService,
    private reservationService: ReservationService,
    private messageService: MessageService
  ) {
    this.userLoggedIn = JSON.parse(
      this.profileService.getProfileFromLocalStorage()!
    );
    this.userId = this.userLoggedIn?.id;
  }

  ngOnInit(): void {

  }

  onDateSelect(): void {
    if (this.selectedDate) {
      const selectedDateStr = this.selectedDate.toLocaleDateString('en-CA');
      this.noDataMessage = null;
      this.availableTimeSlots = [];

      this.bookableUnitService.getBookableUnitsByDay(selectedDateStr).subscribe(
        (data) => {
          this.bookableUnits = data.body;
          console.log(data);
          this.activeStep = 1;
          this.bookableUnits.sort((a, b) => {
            const timeA = a.timeSlot.timeInterval.startTime;
            const timeB = b.timeSlot.timeInterval.startTime;
            return timeA.localeCompare(timeB); // Formatul e HH:mm deci merge corect
          });

          // Construim dropdownul cu label și value
          this.availableTimeSlots = this.bookableUnits.map((unit) => {
            const interval = unit.timeSlot.timeInterval;
            return {
              label: `${interval.startTime} - ${interval.endTime}`,
              value: unit.id,
            };
          });

          if (this.availableTimeSlots.length === 0) {
            this.noDataMessage = 'No interval available';
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'No interval available',
            });
          }
        },
        (error) => {
          console.log(error);
          this.noDataMessage = 'Error fetching data';
          this.messageService.add({
            severity: 'warn',
            summary: 'Error',
            detail: 'Sorry there is an error, come back later',
          });
        }
      );
    }
  }

  bookUnit(): void {
    this.selectedTimeSlot = this.bookableUnits.find(
      (bu) => bu.id == this.selectedBookableUnitId
    )?.timeSlot;
    this.reservationService
      .bookReservation(this.selectedBookableUnitId!, this.userId!)
      .subscribe(
        (data) => {
          // this.messageService.add({
          //   severity: 'success',
          //   summary: 'Booking succesfull',
          //   detail: 'Your booking was created',
          //   life: 5000,
          // });

          this.activeStep = 2;
        },
        (error) => {
          this.messageService.add({
            severity: 'warning',
            summary: 'Info',
            detail: 'Please chose another time',
            life: 5000,
          });
        }
      );
  }

  backToBooking() {
    this.activeStep = 0;
    this.resetForm();
  }

  resetForm(): void {
    this.selectedDate = null;
    this.selectedTimeSlot = undefined;
    this.availableTimeSlots = [];
    this.activeStep = 0;
    this.noDataMessage = null;
  }

  restartBooking(): void {
    this.activeStep = 0;
    this.selectedDate = null;
    this.selectedBookableUnitId = null;
    this.selectedTimeSlot = undefined;
    this.noDataMessage = '';
  }


}
