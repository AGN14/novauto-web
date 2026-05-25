import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SplashService {
  private _showSplash = signal(false);
  showSplash = this._showSplash.asReadonly();

  show(): void {
    this._showSplash.set(true);
  }

  hide(): void {
    this._showSplash.set(false);
  }
}
