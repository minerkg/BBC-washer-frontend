import {Injectable} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class RouteTrackingService {
  private _lastRoute: string = '/';

  get lastRoute(): string {
    return this._lastRoute;
  }

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        filter(event => !['/register'].includes(event.urlAfterRedirects))
      )
      .subscribe((event: NavigationEnd) => {
        this._lastRoute = event.urlAfterRedirects;
      });

  }
}
