import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private API_BASE_URL = 'http://localhost:8082/api/v1';
  public readonly USER_PROFILE_STORAGE_KEY = 'profile';
  private readonly BASIC_AUTH_STORAGE_KEY = 'basicAuthHeader';

  constructor( private http: HttpClient,private authService: AuthService) { }


  getProfileFromLocalStorage(){
    return localStorage.getItem('profile');
  }

  getProfileFromBackend(): Observable<User>{
    const headers = this.authService.getAuthHeaders(false);

    return this.http.get<User>(`${this.API_BASE_URL}/user/me`,{headers});


  }


}
