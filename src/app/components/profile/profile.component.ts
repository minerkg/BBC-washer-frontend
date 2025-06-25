// src/app/components/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
// Importuri PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
// Importuri pentru estetică (fără PasswordModule)
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Module PrimeNG
    CardModule,
    InputTextModule,
    TagModule,
    ToastModule,
    ButtonModule,
    DividerModule,
    AvatarModule,
    SkeletonModule

  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService]
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
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const foundUser = this.profileService.getProfileFromLocalStorage();

    if (foundUser) {
      this.user = JSON.parse(foundUser);
      this.messageService.add({severity:'success', summary:'Succes', detail:'Profilul a fost încărcat din memoria locală.'});
    } else {
      this.profileService.getProfileFromBackend().subscribe({
        next: (data) => {
          this.user = data;
          this.messageService.add({severity:'success', summary:'Succes', detail:'Profilul a fost încărcat de pe server.'});
        },
        error: (error) => {
          console.error('Eroare la preluarea profilului:', error);
          this.messageService.add({severity:'error', summary:'Eroare', detail:'Nu s-a putut încărca profilul.'});
        }
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
    this.messageService.add({severity:'info', summary:'Anulat', detail:'Editarea profilului a fost anulată.'});
  }

  saveProfile(): void {
    if (!this.editedUser) {
      this.messageService.add({severity:'error', summary:'Eroare', detail:'Nu există date de profil pentru a salva.'});
      return;
    }

    if (!this.editedUser.first_name || !this.editedUser.last_name || !this.editedUser.email || !this.editedUser.phone) {
      this.messageService.add({severity:'warn', summary:'Atenție', detail:'Vă rugăm să completați toate câmpurile obligatorii.'});

      return;
    }

    this.userService.updateUserProfile(this.editedUser).subscribe({
      next: (response) => {
        this.messageService.add({severity:'success', summary:'Succes', detail:'Profilul a fost actualizat cu succes!'});

        if (this.user) {
          this.user.first_name = this.editedUser!.first_name;
          this.user.last_name = this.editedUser!.last_name;
          this.user.email = this.editedUser!.email;
          this.user.phone = this.editedUser!.phone;
          localStorage.setItem(this.profileService.getProfileStorageKey(), JSON.stringify(this.user));

        }
        this.editMode = false;
        this.editedUser = null;
      },
      error: (error) => {
        console.error('Eroare la actualizarea profilului:', error);
        const errorMessage = error.error?.message || 'Nu s-a putut actualiza profilul.';
        this.messageService.add({severity:'error', summary:'Eroare', detail: errorMessage});

      }
    });
  }

  changePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
      this.messageService.add({severity:'warn', summary:'Atenție', detail:'Vă rugăm să completați toate câmpurile pentru parolă.'});
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.messageService.add({severity:'error', summary:'Eroare', detail:'Parola nouă și confirmarea nu se potrivesc.'});
      return;
    }
    if (this.newPassword.length < 6) {
      this.messageService.add({severity:'error', summary:'Eroare', detail:'Parola nouă trebuie să aibă cel puțin 6 caractere.'});
      return;
    }

    const passwordChangeRequest = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.userService.changeUserPassword(passwordChangeRequest).subscribe({
      next: (response) => {
        this.messageService.add({severity:'success', summary:'Succes', detail:'Parola a fost schimbată cu succes!'});

        this.currentPassword = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
      },
      error: (error) => {
        console.error('Eroare la schimbarea parolei:', error);
        let errorMessage = 'Nu s-a putut schimba parola.';
        if (error.status === 401 || error.status === 403) {
          errorMessage = 'Parola curentă este incorectă sau acțiunea nu este autorizată.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        this.messageService.add({severity:'error', summary:'Eroare', detail: errorMessage});
      }
    });
  }
}
