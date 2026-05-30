import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { GarageAuthService } from '../../../core/services/garage-auth';
import { LucideAngularModule, ClipboardList, Calendar, User, Car, LogOut } from 'lucide-angular';

export interface DemandeInspection {
  id: number;
  statut: string;
  date_soumission: string;
  date_rdv?: string | null;
  heure_rdv?: string | null;
  annonce: {
    id: number;
    titre: string;
    prix: number;
    vehicule: {
      kilometrage: number;
      modele: {
        nom: string;
        marque: {
          nom: string;
        };
      };
    };
    vendeur: {
      user: {
        nom: string;
        prenom: string;
        telephone: string;
      };
    };
  };
}

@Component({
  selector: 'app-garage-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class GarageDashboard implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  garageAuth = inject(GarageAuthService);

  readonly ClipboardList = ClipboardList;
  readonly Calendar = Calendar;
  readonly User = User;
  readonly Car = Car;
  readonly LogOut = LogOut;

  demandes = signal<DemandeInspection[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.chargerDemandes();
  }

  chargerDemandes() {
    this.loading.set(true);
    this.http.get<DemandeInspection[]>(`${environment.apiUrl}/garage/inspections`)
      .subscribe({
        next: (data) => {
          this.demandes.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Erreur chargement demandes:', err);
          this.loading.set(false);
        }
      });
  }

  inspectionner(demandeId: number) {
    this.router.navigate(['/garage/inspections', demandeId]);
  }

  logout() {
    this.garageAuth.logout().subscribe();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price);
  }
}
