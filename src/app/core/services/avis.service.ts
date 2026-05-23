import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvisService {
  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAvisByAnnonce(annonceId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/catalogue/${annonceId}/avis`);
  }

  soumettre(data: { annonce_id: number, note: number, commentaire?: string }): Observable<any> {
    const token = localStorage.getItem('novauto_token');
    return this.http.post<any>(`${this.API_URL}/acheteur/avis`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getMesAvis(): Observable<any[]> {
    const token = localStorage.getItem('novauto_token');
    return this.http.get<any[]>(`${this.API_URL}/acheteur/avis`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Vendeur
  signalerAvis(id: number, raison: string): Observable<any> {
    const token = localStorage.getItem('novauto_token');
    return this.http.post<any>(`${this.API_URL}/vendeur/avis/${id}/signaler`, { raison }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Admin
  getAvisSignales(): Observable<any[]> {
    const token = localStorage.getItem('novauto_token');
    return this.http.get<any[]>(`${this.API_URL}/admin/avis/signales`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  supprimerAvis(id: number): Observable<any> {
    const token = localStorage.getItem('novauto_token');
    return this.http.post<any>(`${this.API_URL}/admin/avis/${id}/supprimer`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  rejeterSignalement(id: number): Observable<any> {
    const token = localStorage.getItem('novauto_token');
    return this.http.post<any>(`${this.API_URL}/admin/avis/${id}/rejeter-signalement`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
