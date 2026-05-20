import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarqueService {

  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/marques`);
  }

  getModeles(marqueId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/marques/${marqueId}/modeles`);
  }
}