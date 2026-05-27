import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Ne pas ajouter le token pour Cloudinary
  if (req.url.includes('cloudinary.com')) {
    return next(req);
  }

  // Déterminer quel token utiliser selon l'URL
  let token: string | null = null;

  if (req.url.includes('/garage/')) {
    // Routes garage utilisent garage_token
    token = localStorage.getItem('garage_token');
  } else {
    // Routes normales utilisent novauto_token
    token = localStorage.getItem('novauto_token');
  }

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  return next(req);
};