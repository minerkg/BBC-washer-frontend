// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/user.model'; // Import User model

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_BASE_URL = 'http://localhost:8082/api/v1'; // Ensure this matches your backend

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Updates the authenticated user's profile details.
   * @param user The user object with updated fields (first_name, last_name, email, phone).
   */
  updateUserProfile(user: Partial<User>): Observable<any> {
    const headers = this.authService.getAuthHeaders(true); // Content-Type: application/json
    const url = `${this.API_BASE_URL}/user/update`; // Or your specific endpoint for profile update
    // Send only the fields that can be updated by the user
    const updateData = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone
    };
    return this.http.put(url, updateData, { headers, observe: 'response' });
  }

  /**
   * Changes the authenticated user's password.
   * @param passwordChangeRequest An object containing currentPassword and newPassword.
   */
  changeUserPassword(passwordChangeRequest: { currentPassword: string, newPassword: string }): Observable<any> {
    const headers = this.authService.getAuthHeaders(true); // Content-Type: application/json
    const url = `${this.API_BASE_URL}/public/auth/change-password`; // Or your specific endpoint for password change
    return this.http.put(url, passwordChangeRequest, { headers, observe: 'response' });
  }
}
