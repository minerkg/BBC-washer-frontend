import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, switchMap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE_URL = 'http://localhost:8082/api/v1';
  private readonly BASIC_AUTH_STORAGE_KEY = 'basicAuthHeader';
  private readonly USER_ROLE_STORAGE_KEY = 'userRole';

  private currentUserRoleSubject: BehaviorSubject<string | null>;
  public currentUserRole: Observable<string | null>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const storedRole = isPlatformBrowser(this.platformId)
      ? localStorage.getItem(this.USER_ROLE_STORAGE_KEY)
      : null;

    this.currentUserRoleSubject = new BehaviorSubject<string | null>(storedRole);
    this.currentUserRole = this.currentUserRoleSubject.asObservable();
  }

  login(username: string, password: string): Observable<User> {
    const encodedCredentials = btoa(`${username}:${password}`);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.BASIC_AUTH_STORAGE_KEY, encodedCredentials);
    }

    const headers = new HttpHeaders({
      'Authorization': `Basic ${encodedCredentials}`
    });

    // Primul request de test
    return this.http.get(`${this.API_BASE_URL}/user/resource/test`, { headers, observe: 'response' }).pipe(
      tap(() => console.log('Login - authentication test succeeded')),
      switchMap(() => this.fetchAndStoreUserDetails(encodedCredentials)),
      catchError(error => {
        console.error('Login failed', error);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem(this.BASIC_AUTH_STORAGE_KEY);
        }
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.BASIC_AUTH_STORAGE_KEY);
      localStorage.removeItem(this.USER_ROLE_STORAGE_KEY);
    }
    this.currentUserRoleSubject.next(null);
  }

  register(registrationData: any): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/public/auth/register`, registrationData);
  }

  getBasicAuthHeader(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem(this.BASIC_AUTH_STORAGE_KEY)
      : null;
  }

  getAuthHeaders(contentTypeJson: boolean = true): HttpHeaders {
    const basicAuth = this.getBasicAuthHeader();
    if (!basicAuth) {
      throw new Error('No Basic Auth token available.');
    }

    const headersConfig: { [key: string]: string } = {
      'Authorization': `Basic ${basicAuth}`
    };

    if (contentTypeJson) {
      headersConfig['Content-Type'] = 'application/json';
    }

    return new HttpHeaders(headersConfig);
  }

  isAuthenticated(): boolean {
    return !!this.getBasicAuthHeader();
  }

  hasRole(role: string): boolean {
    return this.currentUserRoleSubject.value === role;
  }

  private fetchAndStoreUserDetails(basicAuth: string): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Basic ${basicAuth}`
    });

    return this.http.get<User>(`${this.API_BASE_URL}/user/me`, { headers }).pipe(
      tap(user => {
        let extractedRole: string | null = null;
        if (user.authorities && user.authorities.length > 0) {
          extractedRole = user.authorities[0].authority.replace('ROLE_', '');
        }

        console.log('DEBUG AuthService: Fetched user role:', extractedRole);

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.USER_ROLE_STORAGE_KEY, extractedRole || '');
        }

        this.currentUserRoleSubject.next(extractedRole);
      })
    );
  }
}
