import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getMesReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/acheteur/reservations`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/acheteur/reservations`, data);
  }

  annuler(id: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/acheteur/reservations/${id}/annuler`, {});
  }

  getVendeurReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/vendeur/reservations`);
  }

  confirmer(id: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/vendeur/reservations/${id}/confirmer`, {});
  }
}