import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';


@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  private readonly BASIC_AUTH_STORAGE_KEY = 'basic-auth-token';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isPlatformBrowser(this.platformId)) {
      const credentials = localStorage.getItem(this.BASIC_AUTH_STORAGE_KEY);
        console.log(credentials+ "<---------------------------------CREDENTIALS")
      if (credentials) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Basic ${credentials}`
          }
        });
        return next.handle(cloned);
      }
    }

    return next.handle(req);
  }
}
