import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, Building2, MapPin, Phone, Mail, CheckCircle, XCircle } from 'lucide-angular';

export interface Garage {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  ville: string;
  email: string;
  agree: boolean;
  certifie: boolean;
  date_certification?: string;
  prix_inspection: number;
  photo_profil?: string;
}

export interface GaragesPagination {
  data: Garage[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

@Component({
  selector: 'app-garages',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './garages.html',
  styleUrl: './garages.css',
})
export class Garages implements OnInit {
  private http = inject(HttpClient);

  readonly Building2 = Building2;
  readonly MapPin = MapPin;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;

  garages = signal<Garage[]>([]);
  loading = signal(true);
  actionLoading = signal<number | null>(null);

  ngOnInit() {
    this.chargerGarages();
  }

  chargerGarages() {
    this.loading.set(true);
    this.http.get<GaragesPagination>(`${environment.apiUrl}/admin/garages`)
      .subscribe({
        next: (response) => {
          this.garages.set(response.data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Erreur chargement garages:', err);
          this.loading.set(false);
        }
      });
  }

  certifier(garageId: number) {
    this.actionLoading.set(garageId);
    this.http.post(`${environment.apiUrl}/admin/garages/${garageId}/certifier`, {})
      .subscribe({
        next: () => {
          this.actionLoading.set(null);
          this.chargerGarages();
        },
        error: (err) => {
          console.error('Erreur certification:', err);
          this.actionLoading.set(null);
        }
      });
  }

  suspendre(garageId: number) {
    this.actionLoading.set(garageId);
    this.http.post(`${environment.apiUrl}/admin/garages/${garageId}/suspendre`, {})
      .subscribe({
        next: () => {
          this.actionLoading.set(null);
          this.chargerGarages();
        },
        error: (err) => {
          console.error('Erreur suspension:', err);
          this.actionLoading.set(null);
        }
      });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}
