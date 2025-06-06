// src/app/services/bookable-unit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Ensure this exact path!

@Injectable({
  providedIn: 'root'
})
export class BookableUnitService {
  private API_BASE_URL = 'http://localhost:8082/api/v1'; // Ensure this matches your backend port and context path

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inject AuthService
  ) { }

  /**
   * Fetches all available bookable units from the backend.
   * Requires authentication (Basic Auth header).
   */
  getAllAvailableBookableUnits(): Observable<any> {
    const authHeaderValue = this.authService.getBasicAuthHeader(); // Get the header value
    console.log('DEBUG BookableUnitService: Auth header for /bookable-units:', authHeaderValue); // <--- THIS DEBUG LOG MUST BE PRESENT

    const headers = new HttpHeaders({
      'Authorization': authHeaderValue || '' // Ensure header is properly set
    });
    // The backend endpoint is GET /bookable-units
    return this.http.get(`${this.API_BASE_URL}/bookable-units`, { headers: headers,observe: 'response' });
  }

  /**
   * Makes a reservation for a given bookable unit and user.
   * Requires authentication.
   */
  makeReservation(bookableUnitId: number, userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': this.authService.getBasicAuthHeader() || ''
    });
    // The backend endpoint is POST /reservation?bookableUnitId=...&userId=...
    return this.http.post(
      `${this.API_BASE_URL}/reservation?bookableUnitId=${bookableUnitId}&userId=${userId}`,
      null, // Body is null as parameters are in query string
      { headers: headers }
    );
  }
}
