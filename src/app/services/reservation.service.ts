// src/app/services/reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment'; // To get the auth header

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private API_BASE_URL = environment.API_BASE_URL;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Fetches all active reservations for a specific user.
   * Requires authentication.
   */
  getAllReservationsByUser(profileId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    // The backend endpoint is GET /reservation/{userId}
    return this.http.get(`${this.API_BASE_URL}/reservation/${profileId}`, {
      headers: headers,
    });
  }

  /**
   * Cancels a specific reservation by ID.
   * Requires authentication.
   */
  cancelReservation(reservationId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    // The backend endpoint is DELETE /reservation/{reservationId}
    return this.http.delete(
      `${this.API_BASE_URL}/reservation/${reservationId}`,
      { headers: headers }
    );
  }

  bookReservation(bookableUnitId: number, userID: number): Observable<any> {
    const headers = this.authService.getAuthHeaders(false);
    const params = new HttpParams()
      .set('bookableUnitId', bookableUnitId)
      .set('userId', userID);

    return this.http.post<any>(`${this.API_BASE_URL}/reservation`, null, {
      headers,
      params,
    });
  }
}
