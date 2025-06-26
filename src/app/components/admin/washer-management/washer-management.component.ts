// src/app/components/admin/washer-management/washer-management.component.ts
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WasherService} from '../../../services/washer.service';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown'; // For p-dropdown
import {FormsModule} from '@angular/forms'; // For ngModel
import {ToastModule} from 'primeng/toast';
import {MessageService, ConfirmationService} from 'primeng/api';
import {TableModule} from 'primeng/table'; // For p-table
import {TagModule} from 'primeng/tag'; // For p-tag
import {ConfirmDialogModule} from 'primeng/confirmdialog'; // For p-confirmDialog
import {DialogModule} from 'primeng/dialog'; // For p-dialog
import {DividerModule} from 'primeng/divider'; // For p-divider
import {AuthService} from '../../../services/auth.service'; // <--- Import AuthService

@Component({
  selector: 'app-washer-management',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    ToastModule,
    TableModule,
    TagModule,
    ConfirmDialogModule,
    DialogModule,
    DividerModule
  ],
  templateUrl: './washer-management.component.html',
  styleUrl: './washer-management.component.css',
  providers: [MessageService, ConfirmationService]
})
export class WasherManagementComponent implements OnInit {
  washers: any[] = [];
  newWasher: any = {name: '', capacity: null, status: null};
  washerStatuses: any[] = [];
  washerStatusesForEdit: any[] = [];

  displayEditDialog: boolean = false;
  selectedWasher: any = {};
  isAdmin: boolean = false;

  constructor(
    private washerService: WasherService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {

    this.washerStatuses = [
      {label: 'Available', value: 'AVAILABLE'},
      {label: 'Maintenance', value: 'MAINTENANCE'},
      {label: 'Decommissioned', value: 'DECOMMISSIONED'}
    ];

    this.washerStatusesForEdit = [
      {label: 'Available', value: 'AVAILABLE'},
      {label: 'Maintenance', value: 'MAINTENANCE'}
    ];
  }

  ngOnInit(): void {

    this.authService.currentUserRole.subscribe((role: string | null) => {
      if (role === 'ADMIN' || role === 'EMPLOYEE') {
        this.loadWashers();
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

  loadWashers(): void {
    this.washerService.getAllWashers().subscribe({
      next: (response) => {
        if (response && response.body) {
          this.washers = response.body.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );
          console.log('All Washers:', this.washers);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Washers loaded successfully.'
          });
        } else {
          this.washers = [];
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'No washers found.'
          });
        }
      },
      error: (error) => {
        console.error('Error loading washers:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load washers.'
        });
        if (error.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Access Denied',
            detail: 'You do not have permission to view washers.'
          });
        }
      }
    });
  }


  addWasher(): void {
    if (!this.newWasher.name || this.newWasher.capacity === null || this.newWasher.status === null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all fields for the new washer.'
      });
      return;
    }

    this.washerService.addWasher(this.newWasher).subscribe({
      next: (response) => {
        if (response && response.body) {
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Washer added successfully!'});
          console.log('Washer added:', response.body);
          this.newWasher = {name: '', capacity: null, status: null}; // Reset form
          this.loadWashers(); // Reload list
        }
      },
      error: (error) => {
        console.error('Error adding washer:', error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to add washer.'});
        if (error.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Access Denied',
            detail: 'You do not have permission to add washers.'
          });
        }
      }
    });
  }

  editWasher(washer: any): void {
    this.selectedWasher = {...washer};
    this.displayEditDialog = true;
  }

  updateWasher(): void {
    if (!this.selectedWasher || !this.selectedWasher.id) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'No washer selected for update.'});
      return;
    }

    this.washerService.updateWasher(this.selectedWasher.id, this.selectedWasher).subscribe({
      next: (response) => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Washer updated successfully!'});
        console.log('Washer updated:', response.body);
        this.displayEditDialog = false;
        this.loadWashers(); // Refresh the list
      },
      error: (error) => {
        console.error('Error updating washer:', error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to update washer.'});
        if (error.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Access Denied',
            detail: 'You do not have permission to update washers.'
          });
        }
      }
    });
  }

  confirmDecommission(washerId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to decommission this washer?',
      header: 'Decommission Washer',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(washerId);
        this.decommissionWasher(washerId);
      },
      reject: () => {
        this.messageService.add({severity: 'info', summary: 'Cancelled', detail: 'Decommission cancelled.'});
      }
    });
  }

  decommissionWasher(washerId: number): void {
    this.washerService.decommissionWasher(washerId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Washer decommissioned successfully!'
        });
        console.log('Washer decommissioned:', response.body);
        this.loadWashers(); // Reload list
      },
      error: (error) => {
        console.error('Error decommission washer:', error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to decommission washer.'});
        if (error.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Access Denied',
            detail: 'You do not have permission to decommission washers.'
          });
        } else if (error.status === 404) {
          this.messageService.add({severity: 'error', summary: 'Not Found', detail: 'Washer not found.'});
        }
      }
    });
  }

  getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'MAINTENANCE':
        return 'warning';
      case 'DECOMMISSIONED':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  washerSearchQuery: string = '';

  get filteredWashers() {
    if (!this.washerSearchQuery) {
      return this.washers;
    }

    const query = this.washerSearchQuery.toLowerCase();
    return this.washers.filter(washer =>
      washer.name?.toLowerCase().includes(query) ||
      washer.status?.toLowerCase().includes(query)
    );
  }

  displayAddDialog: boolean = false;

  resetNewWasherForm() {
    this.newWasher = {
      name: '',
      capacity: null,
      status: ''
    };
  }

}
