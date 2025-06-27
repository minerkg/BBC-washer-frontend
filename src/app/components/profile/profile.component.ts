// src/app/components/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
// PrimeNG imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
// Aesthetic modules (without PasswordModule)
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // PrimeNG Modules
    CardModule,
    InputTextModule,
    TagModule,
    ToastModule,
    ButtonModule,
    DividerModule,
    AvatarModule,
    SkeletonModule,
    RouterModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  editedUser: User | null = null;

  editMode: boolean = false;

  currentPassword!: string;
  newPassword!: string;
  confirmNewPassword!: string;

  constructor(
    private profileService: ProfileService,
    private userService: UserService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const foundUser = this.profileService.getProfileFromLocalStorage();

    if (foundUser) {
      this.user = JSON.parse(foundUser);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Profile loaded from local storage.',
      });
    } else {
      this.profileService.getProfileFromBackend().subscribe({
        next: (data) => {
          this.user = data;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile loaded from server.',
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load profile.',
          });
        },
      });
    }
  }

  enableEditMode(): void {
    if (this.user) {
      this.editedUser = { ...this.user };
      this.editMode = true;
    }
  }

  cancelEdit(): void {
    this.editedUser = null;
    this.editMode = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Cancelled',
      detail: 'Profile editing has been cancelled.',
    });
  }

  saveProfile(): void {
    if (!this.editedUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No profile data available to save.',
      });
      return;
    }

    if (
      !this.editedUser.first_name ||
      !this.editedUser.last_name ||
      !this.editedUser.email ||
      !this.editedUser.phone
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please complete all required fields.',
      });
      return;
    }

    this.userService.updateUserProfile(this.editedUser).subscribe({
      next: (response) => {
        console.log(response.body);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully!',
        });

        if (this.user) {
          this.user.first_name = this.editedUser!.first_name;
          this.user.last_name = this.editedUser!.last_name;
          this.user.email = this.editedUser!.email;
          this.user.phone = this.editedUser!.phone;
          localStorage.setItem(
            this.profileService.getProfileStorageKey(),
            JSON.stringify(this.user)
          );
        }

        this.editMode = false;
        this.editedUser = null;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        const errorMessage =
          error.error?.message || 'Could not update the profile.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });
      },
    });
  }

  changePassword(): void {
    if (
      !this.currentPassword ||
      !this.newPassword ||
      !this.confirmNewPassword
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all the password fields.',
      });
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'New password and confirmation do not match.',
      });
      return;
    }

    if (this.newPassword.length < 6) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'New password must be at least 6 characters long.',
      });
      return;
    }

    const passwordChangeRequest = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    };

    this.userService.changeUserPassword(passwordChangeRequest).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password changed successfully!',
        });

        this.currentPassword = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error changing password:', error);
        let errorMessage = 'Could not change password.';
        if (error.status === 401 || error.status === 403) {
          errorMessage =
            'Current password is incorrect or action is not authorized.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });
      },
    });
  }
}
