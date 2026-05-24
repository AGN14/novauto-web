import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getNonLues(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/non-lues`);
  }

  marquerLue(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/lue`, {});
  }

  marquerToutesLues(): Observable<any> {
    return this.http.post(`${this.apiUrl}/toutes-lues`, {});
  }

  supprimer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
