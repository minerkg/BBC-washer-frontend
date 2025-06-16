// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http'; // Must be here
import { provideAnimations } from '@angular/platform-browser/animations'; // Must be here

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // Must be here
    provideAnimations(), // Must be here,
  ]
};
