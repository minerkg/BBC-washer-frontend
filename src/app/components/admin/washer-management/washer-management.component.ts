// src/app/components/admin/washer-management/washer-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WasherService } from '../../../services/washer.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown'; // For p-dropdown
import { FormsModule } from '@angular/forms'; // For ngModel
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table'; // For p-table
import { TagModule } from 'primeng/tag'; // For p-tag
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // For p-confirmDialog
import { DialogModule } from 'primeng/dialog'; // For p-dialog
import { DividerModule } from 'primeng/divider'; // For p-divider
import { AuthService } from '../../../services/auth.service'; // <--- Import AuthService

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
  providers: [MessageService, ConfirmationService] // Provide MessageService and ConfirmationService
})
export class WasherManagementComponent implements OnInit {
  washers: any[] = [];
  newWasher: any = { name: '', capacity: null, status: null };
  washerStatuses: any[] = []; // For add form
  washerStatusesForEdit: any[] = []; // For edit form (excluding IN_USE for direct setting)

  displayEditDialog: boolean = false;
  selectedWasher: any = {}; // Initialize as an empty object, not null

  constructor(
    private washerService: WasherService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService // <--- AuthService is injected here
  ) {
    // Initialize washer statuses for dropdowns
    // WasherStatus: AVAILABLE, IN_USE, MAINTENANCE
    this.washerStatuses = [
      { label: 'Available', value: 'AVAILABLE' },
      { label: 'In Use', value: 'IN_USE' }, // Can be selected manually, though often set by system
      { label: 'Maintenance', value: 'MAINTENANCE' }
    ];
    // For editing, usually you don't manually set IN_USE, as it's real-time.
    // If you allow it, it will overwrite the real-time status temporarily.
    this.washerStatusesForEdit = [
      { label: 'Available', value: 'AVAILABLE' },
      { label: 'Maintenance', value: 'MAINTENANCE' }
    ];
  }

  ngOnInit(): void {
    // Only load washers if user is authenticated and has ADMIN role
    // We subscribe here to react to role changes and to ensure auth state is ready
    this.authService.currentUserRole.subscribe((role: string | null) => {
      if (role === 'ADMIN' || role === 'EMPLOYEE') {
        console.log('DEBUG WasherManagementComponent: User is ADMIN, loading washers.');
        this.loadWashers();
      } else {
        console.log('DEBUG WasherManagementComponent: User is NOT ADMIN, not loading washers.');
        this.washers = []; // Clear washers if not admin
        this.messageService.add({severity:'error', summary:'Access Denied', detail:'You do not have permission to manage washers.'});
        // Optionally, you might want to redirect them away from this page if not admin
        // this.router.navigate(['/dashboard']); // Requires Router injection
      }
    });

    // Also, ensure the initial check on component load if role is already in localStorage
    // This is redundant if the subscribe above immediately fires, but good for robustness
    // if a component is initialized while the subject hasn't emitted yet.
    if (this.authService.hasRole('ADMIN')) {
      console.log('DEBUG WasherManagementComponent: OnInit initial check, user is ADMIN.');
      // loadWashers() will be called by the subscription anyway, so no need to call it twice here.
    } else {
      console.log('DEBUG WasherManagementComponent: OnInit initial check, user is NOT ADMIN.');
    }
  }

  loadWashers(): void {
    this.washerService.getAllWashers().subscribe({ // Using getAllWashers from WasherService
      next: (response) => {
        if (response && response.body) {
          this.washers = response.body;
          console.log('All Washers:', this.washers);
          this.messageService.add({severity:'success', summary:'Success', detail:'Washers loaded successfully.'});
        } else {
          this.washers = [];
          this.messageService.add({severity:'info', summary:'Info', detail:'No washers found.'});
        }
      },
      error: (error) => {
        console.error('Error loading washers:', error);
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to load washers.'});
        // Handle 403 Forbidden specifically (e.g., redirect to login or show access denied)
        if (error.status === 403) {
          this.messageService.add({severity:'error', summary:'Access Denied', detail:'You do not have permission to view washers.'});
        }
      }
    });
  }

  addWasher(): void {
    if (!this.newWasher.name || this.newWasher.capacity === null || this.newWasher.status === null) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Please fill all fields for the new washer.'});
      return;
    }

    this.washerService.addWasher(this.newWasher).subscribe({
      next: (response) => {
        if (response && response.body) {
          this.messageService.add({severity:'success', summary:'Success', detail:'Washer added successfully!'});
          console.log('Washer added:', response.body);
          this.newWasher = { name: '', capacity: null, status: null }; // Reset form
          this.loadWashers(); // Reload list
        }
      },
      error: (error) => {
        console.error('Error adding washer:', error);
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to add washer.'});
        if (error.status === 403) {
          this.messageService.add({severity:'error', summary:'Access Denied', detail:'You do not have permission to add washers.'});
        }
      }
    });
  }

  editWasher(washer: any): void {
    this.selectedWasher = { ...washer }; // Create a copy to avoid direct mutation
    this.displayEditDialog = true;
  }

  updateWasher(): void {
    if (!this.selectedWasher || !this.selectedWasher.id) {
      this.messageService.add({severity:'error', summary:'Error', detail:'No washer selected for update.'});
      return;
    }

    this.washerService.updateWasher(this.selectedWasher.id, this.selectedWasher).subscribe({
      next: (response) => {
        this.messageService.add({severity:'success', summary:'Success', detail:'Washer updated successfully!'});
        console.log('Washer updated:', response.body);
        this.displayEditDialog = false;
        this.loadWashers(); // Refresh the list
      },
      error: (error) => {
        console.error('Error updating washer:', error);
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to update washer.'});
        if (error.status === 403) {
          this.messageService.add({severity:'error', summary:'Access Denied', detail:'You do not have permission to update washers.'});
        }
      }
    });
  }

  confirmDelete(washerId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this washer? This action cannot be undone.',
      header: 'Delete Washer',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(washerId);
        this.deleteWasher(washerId);
      },
      reject: () => {
        this.messageService.add({severity:'info', summary:'Cancelled', detail:'Deletion cancelled.'});
      }
    });
  }

  deleteWasher(washerId: number): void {
    this.washerService.deleteWasher(washerId).subscribe({
      next: (response) => {
        this.messageService.add({severity:'success', summary:'Success', detail:'Washer deleted successfully!'});
        console.log('Washer deleted:', response.body);
        this.loadWashers(); // Reload list
      },
      error: (error) => {
        console.error('Error deleting washer:', error);
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to delete washer.'});
        if (error.status === 403) {
          this.messageService.add({severity:'error', summary:'Access Denied', detail:'You do not have permission to delete washers.'});
        } else if (error.status === 404) {
          this.messageService.add({severity:'error', summary:'Not Found', detail:'Washer not found.'});
        }
      }
    });
  }

  getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (status) {
      case 'AVAILABLE': return 'success';
      case 'IN_USE': return 'info';
      case 'MAINTENANCE': return 'warning';
      default: return 'secondary';
    }
  }
}
