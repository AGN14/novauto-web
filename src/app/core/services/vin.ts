import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VinService {

  private readonly NHTSA_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin';

  constructor(private http: HttpClient) {}

  decodeVin(vin: string): Observable<any> {
    return this.http.get<any>(`${this.NHTSA_URL}/${vin}?format=json`).pipe(
      map(response => {
        const results = response.Results;
        const getValue = (variable: string) => {
          const item = results.find((r: any) => r.Variable === variable);
          return item?.Value && item.Value !== 'Not Applicable' && item.Value !== 'null' && item.Value !== null ? item.Value : null;
        };

        return {
          vin: vin.toUpperCase(),
          wmi: vin.substring(0, 3),
          vds: vin.substring(3, 9),
          vis: vin.substring(9, 17),
          marque: getValue('Make'),
          modele: getValue('Model'),
          annee: getValue('Model Year'),
          type: getValue('Vehicle Type'),
          carrosserie: getValue('Body Class'),
          cylindres: getValue('Engine Number of Cylinders'),
          cylindree: getValue('Displacement (CC)'),
          cylindreeLitres: getValue('Displacement (L)'),
          carburant: getValue('Fuel Type - Primary'),
          transmission: getValue('Transmission Style'),
          vitesses: getValue('Transmission Speeds'),
          traction: getValue('Drive Type'),
          puissance: getValue('Engine Brake (hp) From'),
          puissanceKw: getValue('Engine Power (kW)'),
          pays: getValue('Plant Country'),
          ville: getValue('Plant City'),
          fabricant: getValue('Manufacturer Name'),
          serie: getValue('Series'),
          portes: getValue('Doors'),
          places: getValue('Seats'),
          poidsTotal: getValue('Gross Vehicle Weight Rating From'),
          freinageABS: getValue('Anti-Lock Braking System (ABS)'),
          airbags: getValue('Air Bag Locations (Front)'),
          normeEmission: getValue('Valve Train Design'),
          electrique: getValue('Electrification Level'),
          turbo: getValue('Turbo'),
          codeErreur: getValue('Error Code'),
          descErreur: getValue('Error Text'),
        };
      })
    );
  }
}