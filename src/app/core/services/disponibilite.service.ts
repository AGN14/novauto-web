import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Disponibilite } from '../models/rendez-vous.model';

export interface CreateDisponibiliteDTO {
  jour: string;
  heure_debut: string;
  heure_fin: string;
}

export interface UpdateDisponibiliteDTO {
  heure_debut: string;
  heure_fin: string;
  jour?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DisponibiliteService {
  private vendeurUrl = `${environment.apiUrl}/vendeur/disponibilites`;
  private garageUrl = `${environment.apiUrl}/garage/disponibilites`;

  constructor(private http: HttpClient) {}

  // ===== VENDEUR =====
  getVendeurDisponibilites(): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(this.vendeurUrl);
  }

  creerDisponibilite(data: CreateDisponibiliteDTO): Observable<Disponibilite> {
    return this.http.post<Disponibilite>(this.vendeurUrl, data);
  }

  creerDisponibilitesBatch(jour: string, creneaux: Array<{ heure_debut: string; heure_fin: string }>): Observable<any> {
    return this.http.post(`${this.vendeurUrl}/batch`, { jour, creneaux });
  }

  modifierDisponibilite(id: number, data: UpdateDisponibiliteDTO): Observable<Disponibilite> {
    return this.http.put<Disponibilite>(`${this.vendeurUrl}/${id}`, data);
  }

  supprimerDisponibilite(id: number): Observable<any> {
    return this.http.delete(`${this.vendeurUrl}/${id}`);
  }

  // ===== PUBLIC (pour acheteur) =====
  getDisponibilitesAnnonce(annonceId: number): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(`${environment.apiUrl}/catalogue/${annonceId}/disponibilites`);
  }

  // ===== GARAGE =====
  getGarageDisponibilites(): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(this.garageUrl);
  }

  creerDisponibiliteGarage(data: CreateDisponibiliteDTO): Observable<Disponibilite> {
    return this.http.post<Disponibilite>(this.garageUrl, data);
  }

  getDisponibilitesGarage(garageId: number): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(`${environment.apiUrl}/garages/${garageId}/disponibilites`);
  }
}
