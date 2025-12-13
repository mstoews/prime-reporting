import { Observable, catchError, debounceTime, of, switchMap, take } from 'rxjs';

import { AuthService } from './auth.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { environment } from 'environments/environment';
import { inject } from '@angular/core';

const getHeaders = (): any => {
  const authService = inject(AuthService);
  const route = inject(Router);
  var jwt: string;
  let headers: any = {};

  var jwt = localStorage.getItem ('jwt') as string;
  var tk = '';

  var subject = authService.refreshToken().subscribe((token) => {
    tk = token;
  });

  if (jwt === null || jwt === undefined) {
    route.navigate(['auth/login']);
  }
  if (jwt !== tk) {
    jwt = tk;
  }

  if (jwt !== '') {

    headers['Authorization'] = `Bearer ${jwt}`;
  }
  return headers;
};

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.baseUrl
  var token: any = {};

  const navigationUrl = 'http://localhost:43221/api/common/navigation';
  if (req.url === navigationUrl) {
    return next(req);
  }

  if (req.url.startsWith(baseUrl)) {
    req = req.clone({
      setHeaders: getHeaders(),
    });
    return next(req)
  }
  return next(req)

}
