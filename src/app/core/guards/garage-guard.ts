import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { GarageAuthService } from '../services/garage-auth';

export const garageGuard = () => {
  const garageAuth = inject(GarageAuthService);
  const router = inject(Router);

  if (garageAuth.isAuthenticated()) {
    return true;
  }

  router.navigate(['/garage/login']);
  return false;
};
