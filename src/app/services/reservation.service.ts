// src/app/services/reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // To get the auth header

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private API_BASE_URL = 'http://localhost:8082/api/v1'; // Ensure this matches your backend

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Fetches all active reservations for a specific user.
   * Requires authentication.
   */
  getAllReservationsByUser(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': this.authService.getBasicAuthHeader() || ''
    });
    // The backend endpoint is GET /reservation/{userId}
    return this.http.get(`${this.API_BASE_URL}/reservation/${userId}`, { headers: headers });
  }

  /**
   * Cancels a specific reservation by ID.
   * Requires authentication.
   */
  cancelReservation(reservationId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': this.authService.getBasicAuthHeader() || ''
    });
    // The backend endpoint is DELETE /reservation/{reservationId}
    return this.http.delete(`${this.API_BASE_URL}/reservation/${reservationId}`, { headers: headers });
  }
}
