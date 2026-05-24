import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = `${environment.apiUrl}/paiements`;

  constructor(private http: HttpClient) {}

  initierPaiement(reservationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/initier`, { reservation_id: reservationId });
  }

  verifierPaiement(reservationId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/verifier/${reservationId}`);
  }
}
