import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private API_BASE_URL = environment.API_BASE_URL;
  private readonly USER_PROFILE_STORAGE_KEY = 'profile';
  private readonly BASIC_AUTH_STORAGE_KEY = 'basicAuthHeader';

  constructor(private http: HttpClient, private authService: AuthService) {
  }


  getProfileFromLocalStorage() {
    return localStorage.getItem('profile');
  }

  getProfileFromBackend(): Observable<User> {
    const headers = this.authService.getAuthHeaders(false);
    return this.http.get<User>(`${this.API_BASE_URL}/user/me`,{headers});
  }


  getProfileStorageKey(): string {
    return this.USER_PROFILE_STORAGE_KEY;
  }


}
