import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private API_BASE_URL = 'http://localhost:8082/api/v1';
  public readonly USER_PROFILE_STORAGE_KEY = 'profile';
  private readonly BASIC_AUTH_STORAGE_KEY = 'basicAuthHeader';

  constructor( private http: HttpClient,private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object,) { }


  getProfileFromLocalStorage(){
     if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('profile');
     }
     return "";
    
  }

  getProfileFromBackend(): Observable<User>{
    const headers = this.authService.getAuthHeaders(false);

    return this.http.get<User>(`${this.API_BASE_URL}/user/me`,{headers});


  }


}
