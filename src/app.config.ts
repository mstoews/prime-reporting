import { ApplicationConfig, InjectionToken, importProvidersFrom } from '@angular/core';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';

import {ActiveReportsModule} from '@mescius/activereportsjs-angular';
import Aura from '@primeuix/themes/aura';
import { appRoutes } from './app.routes';
import { authTokenInterceptor } from './auth.token.interceptor';
import { environment } from './environments/environment';
import { initializeApp } from 'firebase/app';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideToastr } from 'ngx-toastr';

const app = initializeApp(environment.firebase);

export const AUTH = new InjectionToken('Firebase auth', {
  providedIn: 'root',
  factory: () => {
    const auth = getAuth();
    if (environment.useEmulators) {
      connectAuthEmulator(auth, 'http://localhost:9199', {
        disableWarnings: true,
      });
    }
    return auth;
  },
});

const CoreProviders = [
  provideHttpClient(withInterceptors([authTokenInterceptor])),
];
export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        importProvidersFrom(ActiveReportsModule),
        provideToastr(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })
    ]
};



