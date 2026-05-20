import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnnonceFilters {
  marque_id?: number;
  modele_id?: number;
  statut_douanier?: string;
  prix_min?: number;
  prix_max?: number;
  vin_verifie?: boolean;
  per_page?: number;
  page?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {

  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getFeatured(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/catalogue/featured`);
  }

  getAll(filters: AnnonceFilters = {}): Observable<any> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get<any>(`${this.API_URL}/catalogue`, { params });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/catalogue/${id}`);
  }
}