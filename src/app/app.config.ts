import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withViewTransitions(),withInMemoryScrolling({ scrollPositionRestoration:'top'})), 
    provideHttpClient(),
    provideCharts(withDefaultRegisterables()), 
    provideServiceWorker('ngsw-worker.js', 
      {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
      })
  ]
};
