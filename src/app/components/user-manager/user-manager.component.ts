import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FullUser } from '../../models/FullUser.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from '../register/register.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    RegisterComponent,
    DialogModule
  
  ],
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.css',
  providers: [MessageService,ConfirmationService]
})
export class UserManagerComponent implements OnInit {
  users: FullUser[] = [];
  selectedRoles: { [username: string]: string } = {};
  roleOptions = [
    { label: 'USER', value: 'ROLE_USER' },
    { label: 'EMPLOYEE', value: 'ROLE_EMPLOYEE' },
    { label: 'ADMIN', value: 'ROLE_ADMIN' }
  ];
  searchQuery: string = '';
  isAdmin: boolean = false;
  showRegisterDialog = false;

  constructor(private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    
    this.isAdmin = this.authService.hasRole('ADMIN');
    if(this.isAdmin){
      this.loadUsers();
    }
  }

  onRegisterDialogHide() {
    // Aici poți reîncărca lista de utilizatori dacă vrei
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
      data.forEach((user) => {
        this.selectedRoles[user.username] = user.authorities[0]?.authority;
      });
    });
  }

  confirmUpdateRole(user: FullUser): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to change ${user.username}'s role to ${this.selectedRoles[user.username]}?`,
      header: 'Confirm Role Change',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateRole(user);
      },
    });
  }
  updateRole(user: FullUser): void {
    let newRole = this.selectedRoles[user.username];

  if (newRole.startsWith('ROLE_')) {
    newRole = newRole.replace('ROLE_', '');
  }
    this.userService.updateUserRole(user.username, newRole).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Updated ${user.username} to ${newRole}`,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to update role for ${user.username}`,
        });
        console.error(err);
      },
    });
  }

  get filteredUsers(): FullUser[] {
    if (!this.searchQuery.trim()) return this.users;
    const q = this.searchQuery.toLowerCase();
    return this.users.filter((user) =>
      user.username.toLowerCase().includes(q) ||
      user.first_name.toLowerCase().includes(q) ||
      user.last_name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  }
}
