import { CanActivateFn } from '@angular/router';

export const acheteurGuard: CanActivateFn = (route, state) => {
  return true;
};
