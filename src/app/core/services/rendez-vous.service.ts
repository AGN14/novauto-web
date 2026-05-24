import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private apiUrl = `${environment.apiUrl}/acheteur/rendez-vous`;
  private vendeurUrl = `${environment.apiUrl}/vendeur/rendez-vous`;

  constructor(private http: HttpClient) {}

  creerRendezVous(data: { annonce_id: number, date_rdv: string, heure_rdv: string, message?: string }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getMesRendezVous(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getRendezVous(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  annuler(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/annuler`, {});
  }

  getRendezVousVendeur(): Observable<any[]> {
    return this.http.get<any[]>(this.vendeurUrl);
  }

  confirmer(id: number): Observable<any> {
    return this.http.post(`${this.vendeurUrl}/${id}/confirmer`, {});
  }

  proposerAutreDate(id: number, data: { date_rdv: string, heure_rdv: string, message_vendeur: string }): Observable<any> {
    return this.http.post(`${this.vendeurUrl}/${id}/proposer-date`, data);
  }

  annulerVendeur(id: number): Observable<any> {
    return this.http.post(`${this.vendeurUrl}/${id}/annuler`, {});
  }
}
