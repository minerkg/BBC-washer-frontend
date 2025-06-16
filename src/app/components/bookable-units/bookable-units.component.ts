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
import { Washer } from '../../models/dtos/washer.mode';
import { BookableUnitDTO } from '../../models/dtos/bookableUnit.model';


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
    this.loadBookableUnits();
  }

  loadBookableUnits(): void{
  
    this.washerService.getAllBookableUnits().subscribe((data) => {
      
      this.bookableUnits=data.body;
      console.log(this.bookableUnits);
    })

  }

  onDateSelect(): void {
    if (this.selectedDate) {
      const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
      console.log(selectedDateStr);
      this.noDataMessage = null;
      this.activeStep = 1;
      this.selectedWasher = null;
      this.availableTimeSlots = [];
      this.selectedTimeSlot = null;
    }
  }

 

  onTimeSlotSelect(): void {
    // No additional logic needed; selectedTimeSlot is set
  }


  getWasherById(id: number): Washer | undefined {
    return this.availableWashers.find(w => w.id === id);
  }

  
  bookUnit(): void {
   
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
