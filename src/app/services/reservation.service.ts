// src/app/services/reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {environment} from "../../environments/environment"; // To get the auth header

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
   * Fetches all active reservations for a specific user.
   * Requires authentication.
   */
  getAllReservationsByUser(userId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    // The backend endpoint is GET /reservation/{userId}
    return this.http.get(`${this.API_BASE_URL}/reservation/${userId}`, { headers: headers });
  }

  /**
   * Cancels a specific reservation by ID.
   * Requires authentication.
   */
  cancelReservation(reservationId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    // The backend endpoint is DELETE /reservation/{reservationId}
    return this.http.delete(`${this.API_BASE_URL}/reservation/${reservationId}`, { headers: headers });
  }

  getAvailableTimeSlots(washerId: number, date: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    const url = `${this.API_BASE_URL}/reservation/available-slots?washerId=${washerId}&date=${date}`;
    return this.http.get(url,{headers: headers});
  }

  makeReservation(washerId: number, date: string, startTime: string, endTime: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    const url = `${this.API_BASE_URL}/reservation?washerId=${washerId}&date=${date}&startTime=${startTime}&endTime=${endTime}`;
    return this.http.post(url, {}, { headers });
  }
}
