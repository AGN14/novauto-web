import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { GarageAuthService } from '../../../core/services/garage-auth';
import { LucideAngularModule, ClipboardList, Calendar, User, Car, LogOut, CheckCircle, AlertCircle, Key } from 'lucide-angular';

export interface DemandeInspection {
  id: number;
  statut: string;
  date_soumission: string;
  date_rdv?: string | null;
  heure_rdv?: string | null;
  code_presence?: string | null;
  code_expire_at?: string | null;
  code_genere_at?: string | null;
  presence_confirmee: boolean;
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
export class GarageDashboard implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private router = inject(Router);
  garageAuth = inject(GarageAuthService);

  readonly ClipboardList = ClipboardList;
  readonly Calendar = Calendar;
  readonly User = User;
  readonly Car = Car;
  readonly LogOut = LogOut;
  readonly CheckCircle = CheckCircle;
  readonly AlertCircle = AlertCircle;
  readonly Key = Key;

  demandes = signal<DemandeInspection[]>([]);
  loading = signal(true);
  generatingCode = signal<number | null>(null);
  codeTimers = new Map<number, any>();
  codeErrors = new Map<number, string>();

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

  genererCode(demandeId: number): void {
    this.generatingCode.set(demandeId);
    this.codeErrors.delete(demandeId); // Effacer les anciennes erreurs

    this.http.post<{ code: string; expire_at: string }>(`${environment.apiUrl}/garage/inspections/${demandeId}/generer-code`, {})
      .subscribe({
        next: (response) => {
          // Recharger les demandes pour avoir le code
          this.chargerDemandes();
          this.generatingCode.set(null);
          this.startCodeTimer(demandeId, response.expire_at);
        },
        error: (err) => {
          console.error('Erreur génération code:', err);
          this.generatingCode.set(null);
          this.codeErrors.set(demandeId, err.error?.message || 'Erreur lors de la génération du code');
          // L'erreur disparaît après 5 secondes
          setTimeout(() => this.codeErrors.delete(demandeId), 5000);
        }
      });
  }

  startCodeTimer(demandeId: number, expireAt: string): void {
    // Nettoyer le timer précédent s'il existe
    if (this.codeTimers.has(demandeId)) {
      clearInterval(this.codeTimers.get(demandeId));
    }

    // Créer un nouveau timer qui se met à jour chaque seconde
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expire = new Date(expireAt).getTime();
      const diff = expire - now;

      if (diff <= 0) {
        clearInterval(timer);
        this.codeTimers.delete(demandeId);
      }
    }, 1000);

    this.codeTimers.set(demandeId, timer);
  }

  getTimeRemaining(expireAt: string | null | undefined): string {
    if (!expireAt) return '';

    const now = new Date().getTime();
    const expire = new Date(expireAt).getTime();
    const diff = expire - now;

    if (diff <= 0) return 'Expiré';

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `Expire dans ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  isCodeExpired(expireAt: string | null | undefined): boolean {
    if (!expireAt) return false;
    return new Date().getTime() > new Date(expireAt).getTime();
  }

  ngOnDestroy(): void {
    // Nettoyer tous les timers
    this.codeTimers.forEach(timer => clearInterval(timer));
    this.codeTimers.clear();
  }
}
