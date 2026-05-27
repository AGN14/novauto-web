import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Garage {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  agree: boolean;
  certifie: boolean;
  date_certification?: string;
  prix_inspection: number;
  photo_profil?: string;
}

export interface GarageLoginResponse {
  garage: Garage;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class GarageAuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  garage = signal<Garage | null>(null);
  token = signal<string | null>(null);

  constructor() {
    const savedToken = localStorage.getItem('garage_token');
    const savedGarage = localStorage.getItem('garage_data');

    if (savedToken && savedGarage) {
      this.token.set(savedToken);
      this.garage.set(JSON.parse(savedGarage));
    }
  }

  login(email: string, password: string): Observable<GarageLoginResponse> {
    return this.http.post<GarageLoginResponse>(`${environment.apiUrl}/garage/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        this.token.set(response.token);
        this.garage.set(response.garage);
        localStorage.setItem('garage_token', response.token);
        localStorage.setItem('garage_data', JSON.stringify(response.garage));
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/garage/logout`, {}).pipe(
      tap(() => {
        this.token.set(null);
        this.garage.set(null);
        localStorage.removeItem('garage_token');
        localStorage.removeItem('garage_data');
        this.router.navigate(['/garage/login']);
      })
    );
  }

  getMe(): Observable<Garage> {
    return this.http.get<Garage>(`${environment.apiUrl}/garage/me`).pipe(
      tap(garage => {
        this.garage.set(garage);
        localStorage.setItem('garage_data', JSON.stringify(garage));
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  getToken(): string | null {
    return this.token();
  }
}
