// src/app/components/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button'; // Adaugat
import { DividerModule } from 'primeng/divider'; // Adaugat
import { UserService } from '../../services/user.service'; // **Noul serviciu**

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    TagModule,
    ToastModule,
    FormsModule,
    ButtonModule, // Adaugat
    DividerModule // Adaugat
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [MessageService]
})
export class ProfileComponent implements OnInit {

  user: User | null = null;
  editedUser: User | null = null; // Used for editing profile data
  editMode: boolean = false;

  currentPassword!: string;
  newPassword!: string;
  confirmNewPassword!: string;

  constructor(
    private profileService: ProfileService,
    private userService: UserService, // Inject User Service
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const foundUser = this.profileService.getProfileFromLocalStorage();

    if (foundUser) {
      this.user = JSON.parse(foundUser);
      this.messageService.add({severity:'success', summary:'Success', detail:'Profile loaded from local storage.'});
    } else {
      this.messageService.add({severity:'info', summary:'Loading', detail:'Fetching profile from server...'});
      this.profileService.getProfileFromBackend().subscribe({
        next: (data) => {
          this.user = data;
          this.messageService.add({severity:'success', summary:'Success', detail:'Profile loaded from server.'});
        },
        error: (error) => {
          console.error('Error fetching profile:', error);
          this.messageService.add({severity:'error', summary:'Error', detail:'Failed to load profile.'});
        }
      });
    }
  }

  enableEditMode(): void {
    if (this.user) {
      this.editedUser = { ...this.user }; // Create a deep copy to avoid direct mutation
      this.editMode = true;
    }
  }

  cancelEdit(): void {
    this.editedUser = null;
    this.editMode = false;
    this.messageService.add({severity:'info', summary:'Cancelled', detail:'Profile editing cancelled.'});
  }

  saveProfile(): void {
    if (!this.editedUser) {
      this.messageService.add({severity:'error', summary:'Error', detail:'No profile data to save.'});
      return;
    }

    // Basic validation
    if (!this.editedUser.first_name || !this.editedUser.last_name || !this.editedUser.email || !this.editedUser.phone) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Please fill all required profile fields.'});
      return;
    }

    this.userService.updateUserProfile(this.editedUser).subscribe({
      next: (response) => {
        this.messageService.add({severity:'success', summary:'Success', detail:'Profile updated successfully!'});
        // Update the main user object with edited data and exit edit mode
        if (this.user) {
          this.user.first_name = this.editedUser!.first_name;
          this.user.last_name = this.editedUser!.last_name;
          this.user.email = this.editedUser!.email;
          this.user.phone = this.editedUser!.phone;
          // Update localStorage if necessary
          localStorage.setItem(this.profileService.getProfileStorageKey(), JSON.stringify(this.user));
        }
        this.editMode = false;
        this.editedUser = null;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        let errorMessage = 'Failed to update profile.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.messageService.add({severity:'error', summary:'Error', detail: errorMessage});
      }
    });
  }

  changePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Please fill all password fields.'});
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.messageService.add({severity:'error', summary:'Error', detail:'New password and confirmation do not match.'});
      return;
    }
    if (this.newPassword.length < 6) { // Example: Minimum password length
      this.messageService.add({severity:'error', summary:'Error', detail:'New password must be at least 6 characters long.'});
      return;
    }

    const passwordChangeRequest = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.userService.changeUserPassword(passwordChangeRequest).subscribe({
      next: (response) => {
        this.messageService.add({severity:'success', summary:'Success', detail:'Password changed successfully!'});
        // Clear password fields
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
      },
      error: (error) => {
        console.error('Error changing password:', error);
        let errorMessage = 'Failed to change password.';
        if (error.status === 401 || error.status === 403) {
          errorMessage = 'Incorrect current password or unauthorized.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.messageService.add({severity:'error', summary:'Error', detail: errorMessage});
      }
    });
  }
}
