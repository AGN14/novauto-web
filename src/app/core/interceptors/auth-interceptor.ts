import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  const authReq = token
    ? req.clone({
        headers: req.headers
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
      })
    : req.clone({
        headers: req.headers
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
      });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('novauto_token');
        localStorage.removeItem('novauto_user');
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};