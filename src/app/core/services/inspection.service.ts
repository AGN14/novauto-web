import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getGarages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/garages`);
  }

  demanderInspection(annonceId: number, garageId: number, dateRdv?: string, heureRdv?: string): Observable<any> {
    const token = localStorage.getItem('novauto_token');
    return this.http.post<any>(`${this.API_URL}/vendeur/inspections`, {
      annonce_id: annonceId,
      garage_id: garageId,
      date_rdv: dateRdv,
      heure_rdv: heureRdv,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getMesInspections(): Observable<any[]> {
    const token = localStorage.getItem('novauto_token');
    return this.http.get<any[]>(`${this.API_URL}/vendeur/inspections`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}