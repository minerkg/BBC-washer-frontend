// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/user.model'; // Import User model
import { environment } from '../../environments/environment';
import { UpdateUserDto } from '../models/dtos/updateUser.model';
import { FullUser } from '../models/FullUser.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_BASE_URL =  environment.API_BASE_URL; 

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Updates the authenticated user's profile details.
   * @param user The user object with updated fields (first_name, last_name, email, phone).
   */
  updateUserProfile(updatedUser: User): Observable<any> {
    const headers = this.authService.getAuthHeaders(true); // Content-Type: application/json
    const url = `${this.API_BASE_URL}/public/auth/update-user`; // Or your specific endpoint for profile update
   const userRequest: UpdateUserDto = {
    username: updatedUser.username,
    first_name: updatedUser.first_name,
    last_name: updatedUser.last_name,
    email: updatedUser.email,
    phone: updatedUser.phone
   }

    return this.http.put(url, userRequest, { headers});
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

  getAllUsers(): Observable<FullUser[]> {
    const headers = this.authService.getAuthHeaders(true);
    return this.http.get<FullUser[]>(`${this.API_BASE_URL}/users`, {headers});
  }

  updateUserRole(username: string, newRole: string): Observable<any> {
    const headers = this.authService.getAuthHeaders(true);
    return this.http.put(`${this.API_BASE_URL}/users/update-role`, {
      username,
      newRole
    },{headers});
  }






}
