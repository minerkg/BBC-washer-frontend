// src/app/services/bookable-unit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {environment} from "../../environments/environment"; // Ensure this exact path!

@Injectable({
  providedIn: 'root'
})
export class BookableUnitService {
  private API_BASE_URL = environment.API_BASE_URL;

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inject AuthService
  ) { }

  getAllAvailableBookableUnits(): Observable<any> {
    const headers = this.authService.getAuthHeaders();

    return this.http.get<any>(`${this.API_BASE_URL}/bookable-units`, {headers});
  }


  makeReservation(bookableUnitId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(
      `${this.API_BASE_URL}/reservation?bookableUnitId=${bookableUnitId}`,null, // Body is null as parameters are in query string
      { headers }
    );
  }
}
