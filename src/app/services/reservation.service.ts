// src/app/services/reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private API_BASE_URL = environment.API_BASE_URL;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Preia toate rezervările pentru un utilizator specific.
   * Apelează GET /reservation/{userId}
   */
  getAllReservationsByUser(userId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`${this.API_BASE_URL}/reservation/${userId}`, { headers, observe: 'response' });
  }

  /**
   * Creează o nouă rezervare.
   * Apelează POST /reservation
   */
  makeReservation(bookableUnitId: number, userId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    const params = new HttpParams()
      .set('bookableUnitId', bookableUnitId.toString())
      .set('userId', userId.toString());
    // MODIFICARE: URL Construit corect
    return this.http.post(`${this.API_BASE_URL}/reservation`, null, { headers, params, observe: 'response' });
  }

  /**
   * Anulează o rezervare existentă.
   * Apelează DELETE /reservation/{reservationId}
   */
  cancelReservation(reservationId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`${this.API_BASE_URL}/reservation/${reservationId}`, {
      headers: headers,
      observe: 'response'
    });
  }

  /**
   * Preia absolut toate rezervările din sistem (pentru panoul de administrare).
   * Apelează GET /reservation/admin/all
   */
  getAllReservationsForAdmin(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`${this.API_BASE_URL}/reservation/admin/all`, {
      headers: headers,
      observe: 'response'
    });
  }

  /**
   * Actualizează statusul unei rezervări specifice.
   * Apelează PUT /reservation/{reservationId}/status
   */
  updateReservationStatus(reservationId: number, status: string): Observable<any> {
    const headers = this.authService.getAuthHeaders(true);
    const body = { status: status };
    return this.http.put(`${this.API_BASE_URL}/reservation/${reservationId}/status`, body, {
      headers,
      observe: 'response'
    });
  }
}
