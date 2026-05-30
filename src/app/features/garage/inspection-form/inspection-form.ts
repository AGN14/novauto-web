import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, CheckCircle, XCircle, ArrowLeft, Car, AlertCircle, Trash2, Upload } from 'lucide-angular';

export interface RapportDetail {
  id: number;
  statut: string;
  date_soumission: string;
  presence_confirmee: boolean;
  code_presence?: string | null;
  code_expire_at?: string | null;
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
  readonly Trash2 = Trash2;
  readonly Upload = Upload;

  rapportId = signal<number>(0);
  rapport = signal<RapportDetail | null>(null);
  loading = signal(true);
  submitting = signal(false);
  errorMessage = signal('');
  showRejectModal = signal(false);
  uploadedPhotos = signal<string[]>([]);

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

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validation: image uniquement
      if (!file.type.startsWith('image/')) {
        this.errorMessage.set('Veuillez sélectionner une image valide');
        return;
      }

      // Validation: taille max 5MB
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage.set('L\'image ne doit pas dépasser 5 MB');
        return;
      }

      // Simuler l'upload (convertir en base64 pour démo)
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const photoUrl = e.target.result;
        this.uploadedPhotos.update(photos => [...photos, photoUrl]);
        this.errorMessage.set('');
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(index: number): void {
    this.uploadedPhotos.update(photos => photos.filter((_, i) => i !== index));
  }

  canSubmit(): boolean {
    return this.inspectionForm.valid && this.uploadedPhotos().length >= 2;
  }

  onSubmitValidation() {
    if (this.inspectionForm.invalid || this.uploadedPhotos().length < 2) {
      this.errorMessage.set('Veuillez remplir tous les champs et ajouter au moins 2 photos');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    const payload = {
      ...this.inspectionForm.value,
      photos: this.uploadedPhotos()
    };

    this.http.post(`${environment.apiUrl}/garage/inspections/${this.rapportId()}/soumettre`, payload)
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
