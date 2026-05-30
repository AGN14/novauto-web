import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/acheteur/reservations`;
  private vendeurUrl = `${environment.apiUrl}/vendeur/reservations`;

  constructor(private http: HttpClient) {}

  creerReservation(annonceId: number, dateRdv?: string, heureRdv?: string): Observable<any> {
    return this.http.post(this.apiUrl, {
      annonce_id: annonceId,
      date_rdv: dateRdv,
      heure_rdv: heureRdv
    });
  }

  getMesReservations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getReservation(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  annuler(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/annuler`, {});
  }

  getVendeurReservations(): Observable<any[]> {
    return this.http.get<any[]>(this.vendeurUrl);
  }

  confirmer(id: number): Observable<any> {
    return this.http.post(`${this.vendeurUrl}/${id}/confirmer`, {});
  }

  annulerVendeur(id: number): Observable<any> {
    return this.http.post(`${this.vendeurUrl}/${id}/annuler`, {});
  }
}