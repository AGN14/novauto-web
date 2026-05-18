import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const vendeurGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isVendeur()) {
    return true;
  }

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  router.navigate(['/']);
  return false;
};