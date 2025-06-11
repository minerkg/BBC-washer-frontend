// src/app/components/bookable-units/bookable-units.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For ngIf, ngFor, date pipe
import { BookableUnitService } from '../../services/bookable-unit.service'; // Import the new service
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MenuItem, MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // CORRECTED IMPORT PATH
import { CalendarModule } from 'primeng/calendar';
import { StepsModule } from 'primeng/steps';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { WasherService } from '../../services/washer.service';

interface BookableUnitDTO {
  id: number;
  washerId: number;
  washerName: string;
  washerCapacity: number;
  washerStatus: string;
  timeSlotId: number;
  timeIntervalDate: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface Washer {
  id: number;
  name: string;
  capacity: number;
  status: string;
}

interface TimeSlot {
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
}


@Component({
  selector: 'app-bookable-units',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ToastModule,
    RouterModule,
    CalendarModule,FormsModule,DropdownModule,StepsModule

  ],
  templateUrl: './bookable-units.component.html',
  styleUrl: './bookable-units.component.css',
  providers: [MessageService] // Provide MessageService
})
export class BookableUnitsComponent implements OnInit {
  steps: MenuItem[] = [
    { label: 'Select Date' },
    { label: 'Select Washer' },
    { label: 'Select Time Slot' }
  ];
  activeStep: number = 0;

  bookableUnits: BookableUnitDTO[] = [];
  selectedDate: Date | null = null;
  minDate: Date = new Date(); // Today
  maxDate: Date = new Date(new Date().setDate(new Date().getDate() + 7)); // One week from now

  availableWashers: Washer[] = [];
  selectedWasher: number | null = null;

  availableTimeSlots: { startTime: string; endTime: string; timeRange: string }[] = [];
  selectedTimeSlot: string | null = null;

  noDataMessage: string | null = null;

  constructor(
    private bookableUnitService: BookableUnitService,
    private messageService: MessageService,
    private authService: AuthService, // AuthService is injected here
    private reservationService: ReservationService,
    private washerService: WasherService
  ) {

   }

  ngOnInit(): void {
    // this.loadAvailableBookableUnits();
    this.loadAvailableWashers();
  }

  loadAvailableWashers(): void{
    this.washerService.getAllAvailableWashers().subscribe((data)=>{
      this.availableWashers=data.body;
    },
    (error) => {
      console.log(error)
    }
  )
  }

  // loadAvailableBookableUnits(): void {
  //   this.bookableUnitService.getAllAvailableBookableUnits().subscribe({
  //     next: (response) => {
  //       if (response && response.body) {
  //         this.bookableUnits = response.body;
  //         console.log('Available Bookable Units:', this.bookableUnits);
  //         this.messageService.add({severity:'success', summary:'Success', detail:'Bookable units loaded successfully.'});
  //       } else {
  //         this.bookableUnits = [];
  //         this.messageService.add({severity:'info', summary:'Info', detail:'No bookable units found.'});
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error loading bookable units:', error);
  //       this.messageService.add({severity:'error', summary:'Error', detail:'Failed to load bookable units.'});
  //       // Handle unauthorized errors if necessary (e.g., redirect to login)
  //     }
  //   });
  // }

  // onDateSelect(): void {
  //   if (this.selectedDate) {
  //     const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
  //     // Filter washers available on the selected date
  //     console.log("----> selected date"+selectedDateStr);
  //     const washerMap = new Map<number, Washer>();
  //     console.log(this.bookableUnits[2]);
  //     console.log("----> book 2 date"+this.bookableUnits[2].timeIntervalDate);
  //     console.log(this.bookableUnits[2].timeIntervalDate == selectedDateStr && this.bookableUnits[2].available);
  //     this.bookableUnits
  //       .filter(unit => unit.timeIntervalDate === selectedDateStr && unit.available)
  //       .forEach(unit => {
  //         console.log(" thisis the unit ---> "+unit);
  //         washerMap.set(unit.washerId, {
  //           id: unit.washerId,
  //           name: unit.washerName,
  //           capacity: unit.washerCapacity,
  //           status: unit.washerStatus
  //         });
  //       });
  //       console.log(washerMap);
  //     this.availableWashers = Array.from(washerMap.values());
  //     if (this.availableWashers.length === 0) {
  //       this.noDataMessage = 'No washers available for the selected date.';
  //       this.activeStep = 0;
  //     } else {
  //       this.noDataMessage = null;
  //       this.activeStep = 1;
  //       this.selectedWasher = null;
  //       this.availableTimeSlots = [];
  //       this.selectedTimeSlot = null;
  //     }
  //   }
  // }


  // onWasherSelect(): void {
  //   if (this.selectedDate && this.selectedWasher) {
  //     const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
  //     // Filter time slots for the selected washer and date
  //     this.availableTimeSlots = this.bookableUnits
  //       .filter(unit => unit.timeIntervalDate === selectedDateStr && unit.washerId === this.selectedWasher && unit.available)
  //       .map(unit => ({
  //         id: unit.timeSlotId,
  //         timeRange: `${unit.startTime} - ${unit.endTime}`
  //       }));
  //     if (this.availableTimeSlots.length === 0) {
  //       this.noDataMessage = 'No time slots available for the selected washer and date.';
  //       this.activeStep = 1;
  //     } else {
  //       this.noDataMessage = null;
  //       this.activeStep = 2;
  //       this.selectedTimeSlot = null;
  //     }
  //   }
  // }


  onDateSelect(): void {
    if (this.selectedDate) {
      const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
      this.noDataMessage = null;
      this.activeStep = 1;
      this.selectedWasher = null;
      this.availableTimeSlots = [];
      this.selectedTimeSlot = null;
    }
  }

  onWasherSelect(): void {
    if (this.selectedDate && this.selectedWasher) {
      const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
      this.reservationService.getAvailableTimeSlots(this.selectedWasher, selectedDateStr).subscribe({
        next: (response) => {
          this.availableTimeSlots = response.body.map((slot: TimeSlot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            timeRange: `${slot.startTime} - ${slot.endTime}`
          }));
          if (this.availableTimeSlots.length === 0) {
            this.noDataMessage = 'No time slots available for the selected washer and date.';
            this.activeStep = 1;
          } else {
            this.noDataMessage = null;
            this.activeStep = 2;
            this.selectedTimeSlot = null;
          }
        },
        error: (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load time slots.' });
          console.error('Error fetching time slots:', error);
        }
      });
    }
  }

  onTimeSlotSelect(): void {
    // No additional logic needed; selectedTimeSlot is set
  }








  getWasherById(id: number): Washer | undefined {
    return this.availableWashers.find(w => w.id === id);
  }

  // getTimeSlotById(id: number): TimeSlot | undefined {
  //   return this.availableTimeSlots.find(ts => ts.id === id);
  // }


  // bookUnit(): void {
  //   if (this.selectedDate && this.selectedWasher && this.selectedTimeSlot) {
  //     const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
  //     // Find the bookable unit ID based on date, washer, and time slot
  //     const bookableUnit = this.bookableUnits.find(
  //       unit => unit.timeIntervalDate === selectedDateStr &&
  //               unit.washerId === this.selectedWasher &&
  //               unit.timeSlotId === this.selectedTimeSlot &&
  //               unit.available
  //     );
  //     if (bookableUnit) {
  //       this.bookableUnitService.makeReservation(bookableUnit.id).subscribe({
  //         next: (response) => {
  //           this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Unit booked successfully!' });
  //           // Update local data to reflect booking
  //           this.bookableUnits = this.bookableUnits.filter(unit => unit.id !== bookableUnit.id);
  //           this.resetForm();
  //         },
  //         error: (error) => {
  //           this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message || 'Failed to book unit.' });
  //         }
  //       });
  //     } else {
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Selected unit is no longer available.' });
  //     }
  //   }
  // }

  bookUnit(): void {
    if (this.selectedDate && this.selectedWasher && this.selectedTimeSlot) {
      const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
      const selectedSlot = this.availableTimeSlots.find(slot => slot.startTime === this.selectedTimeSlot);
      if (selectedSlot) {
        this.reservationService.makeReservation(
          this.selectedWasher,
          selectedDateStr,
          selectedSlot.startTime,
          selectedSlot.endTime
        ).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reservation booked successfully!' });
            this.resetForm();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message || 'Failed to book reservation.' });
            console.error('Reservation error:', error);
          }
        });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid time slot selected.' });
      }
    }
  }




  resetForm(): void {
    this.selectedDate = null;
    this.selectedWasher = null;
    this.selectedTimeSlot = null;
    this.availableWashers = [];
    this.availableTimeSlots = [];
    this.activeStep = 0;
    this.noDataMessage = null;
  }





}
