import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const acheteurGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAcheteur()) {
    return true;
  }

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  router.navigate(['/']);
  return false;
};