import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, CheckCircle, XCircle, ArrowLeft, Car, AlertCircle } from 'lucide-angular';

export interface RapportDetail {
  id: number;
  statut: string;
  date_soumission: string;
  annonce: {
    id: number;
    titre: string;
    prix: number;
    vehicule: {
      vin: string;
      kilometrage: number;
      annee: number;
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
        email: string;
      };
    };
  };
}

@Component({
  selector: 'app-inspection-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './inspection-form.html',
  styleUrls: ['./inspection-form.css']
})
export class InspectionForm implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly ArrowLeft = ArrowLeft;
  readonly Car = Car;
  readonly AlertCircle = AlertCircle;

  rapportId = signal<number>(0);
  rapport = signal<RapportDetail | null>(null);
  loading = signal(true);
  submitting = signal(false);
  errorMessage = signal('');
  showRejectModal = signal(false);

  etats = ['EXCELLENT', 'BON', 'MOYEN', 'MAUVAIS'];

  inspectionForm = this.fb.group({
    etat_carrosserie: ['', Validators.required],
    etat_moteur: ['', Validators.required],
    etat_freins: ['', Validators.required],
    etat_pneus: ['', Validators.required],
    kilometrage_verifie: [0, [Validators.required, Validators.min(0)]],
    observations: ['', Validators.maxLength(2000)]
  });

  rejectForm = this.fb.group({
    motif: ['', [Validators.required, Validators.maxLength(500)]]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.rapportId.set(+id);
      this.chargerRapport();
    }
  }

  chargerRapport() {
    this.loading.set(true);
    this.http.get<RapportDetail[]>(`${environment.apiUrl}/garage/inspections`)
      .subscribe({
        next: (demandes) => {
          const rapport = demandes.find(d => d.id === this.rapportId());
          if (rapport) {
            this.rapport.set(rapport);
            this.inspectionForm.patchValue({
              kilometrage_verifie: rapport.annonce.vehicule.kilometrage
            });
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Erreur chargement rapport:', err);
          this.loading.set(false);
          this.router.navigate(['/garage/dashboard']);
        }
      });
  }

  getEtatClass(etat: string): string {
    switch (etat) {
      case 'EXCELLENT': return 'etat-excellent';
      case 'BON': return 'etat-bon';
      case 'MOYEN': return 'etat-moyen';
      case 'MAUVAIS': return 'etat-mauvais';
      default: return '';
    }
  }

  onSubmitValidation() {
    if (this.inspectionForm.invalid) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    this.http.post(`${environment.apiUrl}/garage/inspections/${this.rapportId()}/soumettre`, this.inspectionForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/garage/dashboard']);
        },
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(err.error?.message || 'Erreur lors de la soumission');
        }
      });
  }

  openRejectModal() {
    this.showRejectModal.set(true);
  }

  closeRejectModal() {
    this.showRejectModal.set(false);
    this.rejectForm.reset();
  }

  onSubmitRejection() {
    if (this.rejectForm.invalid) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    this.http.post(`${environment.apiUrl}/garage/inspections/${this.rapportId()}/rejeter`, this.rejectForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/garage/dashboard']);
        },
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(err.error?.message || 'Erreur lors du rejet');
        }
      });
  }

  retour() {
    this.router.navigate(['/garage/dashboard']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price);
  }
}
