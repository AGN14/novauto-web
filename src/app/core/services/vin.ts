import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VinService {

  private readonly API_URL = 'http://localhost:8000/api';
  private readonly NHTSA_API = 'https://vpic.nhtsa.dot.gov/api/vehicles';

  constructor(private http: HttpClient) {}

  decodeVin(vin: string): Observable<any> {
    // Appeler directement l'API NHTSA pour obtenir toutes les informations
    return this.http.get<any>(`${this.NHTSA_API}/DecodeVin/${vin}?format=json`).pipe(
      map(response => {
        const results = response.Results;

        // Extraire les informations importantes
        const data: any = {
          vin: vin,
          marque: this.getValueByName(results, 'Make'),
          modele: this.getValueByName(results, 'Model'),
          annee: this.getValueByName(results, 'Model Year'),
          carburant: this.getValueByName(results, 'Fuel Type - Primary'),
          carrosserie: this.getValueByName(results, 'Body Class'),
          transmission: this.getValueByName(results, 'Transmission Style'),
          pays_origine: this.getValueByName(results, 'Plant Country'),
          fabricant: this.getValueByName(results, 'Manufacturer Name'),
          cylindres: this.getValueByName(results, 'Engine Number of Cylinders'),
          portes: this.getValueByName(results, 'Doors'),
          places: this.getValueByName(results, 'Seating Capacity') || this.getValueByName(results, 'Passenger Seating Capacity'),
          type_vehicule: this.getValueByName(results, 'Vehicle Type'),
          segment: this.getValueByName(results, 'Vehicle Descriptor'),
        };

        return data;
      })
    );
  }

  private getValueByName(results: any[], name: string): string | null {
    const item = results.find(r => r.Variable === name);
    return item && item.Value && item.Value !== '' && item.Value !== 'Not Applicable' ? item.Value : null;
  }
}