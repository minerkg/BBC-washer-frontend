import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { BookableUnitDTO } from '../models/dtos/bookableUnit.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WasherService {
  private API_BASE_URL = environment.API_BASE_URL;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  addWasher(washerData: any): Observable<any> {
    const headers = this.authService.getAuthHeaders(true);
    return this.http.post(`${this.API_BASE_URL}/admin/washers`, washerData, { headers });
  }

  getAllWashers(): Observable<any> {
    const headers = this.authService.getAuthHeaders(false);
    return this.http.get(`${this.API_BASE_URL}/admin/washers`, { headers });
  }

  getWasherById(id: number): Observable<any> {
    const headers = this.authService.getAuthHeaders(false);
    return this.http.get(`${this.API_BASE_URL}/admin/washers/${id}`, { headers });
  }

  updateWasher(id: number, washerData: any): Observable<any> {
    const headers = this.authService.getAuthHeaders(true);
    return this.http.put(`${this.API_BASE_URL}/admin/washers/${id}`, washerData, { headers });
  }

  decommissionWasher(id: number): Observable<any> {
    const headers = this.authService.getAuthHeaders(false);
    return this.http.delete(`${this.API_BASE_URL}/admin/washers/${id}`, { headers });
  }

  getAllAvailableWashers(): Observable<any>{
    const headers = this.authService.getAuthHeaders(false);
    return this.http.get(`${this.API_BASE_URL}/admin/washers/available/all`,{headers})
  }

  getAllBookableUnits(): Observable<any>{
    const headers = this.authService.getAuthHeaders(false);
    return this.http.get<BookableUnitDTO[]>(`${this.API_BASE_URL}/bookable-units`,{headers})
  }
}
