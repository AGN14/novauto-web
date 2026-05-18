import { CanActivateFn } from '@angular/router';

export const vendeurGuard: CanActivateFn = (route, state) => {
  return true;
};
