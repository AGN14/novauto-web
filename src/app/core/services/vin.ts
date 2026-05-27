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
          places: this.getValueByName(results, 'Number of Seats') || this.getValueByName(results, 'Seating Capacity'),
          type_vehicule: this.getValueByName(results, 'Vehicle Type'),
          segment: this.getValueByName(results, 'Vehicle Descriptor'),

          // Moteur détaillé
          cylindree: this.getValueByName(results, 'Displacement (L)'),
          puissance: this.getValueByName(results, 'Engine Brake (hp) From'),
          configuration_moteur: this.getValueByName(results, 'Engine Configuration'),
          modele_moteur: this.getValueByName(results, 'Engine Model'),
          turbo: this.getValueByName(results, 'Turbo'),

          // Transmission & Direction
          vitesses: this.getValueByName(results, 'Transmission Speeds'),
          roues_motrices: this.getValueByName(results, 'Drive Type'),

          // Dimensions & Poids
          poids: this.getValueByName(results, 'Curb Weight (pounds)'),
          empattement: this.getValueByName(results, 'Wheel Base (inches) From'),
          largeur_voie: this.getValueByName(results, 'Track Width (inches)'),

          // Sécurité Active
          abs: this.getValueByName(results, 'Anti-lock Braking System (ABS)'),
          esc: this.getValueByName(results, 'Electronic Stability Control (ESC)'),
          controle_traction: this.getValueByName(results, 'Traction Control'),

          // Airbags
          airbags_avant: this.getValueByName(results, 'Front Air Bag Locations'),
          airbags_lateraux: this.getValueByName(results, 'Side Air Bag Locations'),
          airbags_rideaux: this.getValueByName(results, 'Curtain Air Bag Locations'),

          // Assistance à la Conduite
          camera_recul: this.getValueByName(results, 'Backup Camera'),
          radar_recul: this.getValueByName(results, 'Parking Assist'),
          alerte_angle_mort: this.getValueByName(results, 'Blind Spot Warning (BSW)'),
          alerte_franchissement: this.getValueByName(results, 'Lane Departure Warning (LDW)'),
          freinage_urgence: this.getValueByName(results, 'Forward Collision Warning (FCW)'),

          // Autres
          prix_base: this.getValueByName(results, 'Base Price ($)'),
          serie: this.getValueByName(results, 'Series'),
          finition: this.getValueByName(results, 'Trim'),
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