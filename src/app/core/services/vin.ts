import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VinService {

  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  decodeVin(vin: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/vin/decode`, { vin });
  }
}