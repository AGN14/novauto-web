import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnonceService } from '../../../core/services/annonce';
import { CloudinaryService } from '../../../core/services/cloudinary.service';
import { LucideAngularModule, ArrowLeft, Save, AlertTriangle, CheckCircle, Trash2, Plus, Upload } from 'lucide-angular';

@Component({
  selector: 'app-modifier-annonce',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './modifier-annonce.html',
  styleUrl: './modifier-annonce.css'
})
export class ModifierAnnonce implements OnInit {

  readonly ArrowLeft = ArrowLeft;
  readonly Save = Save;
  readonly AlertTriangle = AlertTriangle;
  readonly CheckCircle = CheckCircle;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;
  readonly Upload = Upload;

  annonceId = signal<number>(0);
  annonce = signal<any>(null);
  form: FormGroup;
  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Photos
  photos = signal<string[]>([]);
  isUploadingPhoto = signal(false);
  uploadError = signal('');

  constructor(
    private fb: FormBuilder,
    private annonceService: AnnonceService,
    private cloudinaryService: CloudinaryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      titre:               ['', [Validators.required, Validators.minLength(10)]],
      prix:                ['', [Validators.required, Validators.min(1)]],
      montant_reservation: ['', [Validators.min(10000)]],
      kilometrage:         ['', [Validators.required, Validators.min(0)]],
      statut_douanier:     ['DEDOUANE', [Validators.required]],
      ville:               ['Cotonou'],
      description:         [''],
      statut:              ['DISPONIBLE', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.annonceId.set(id);
    this.loadAnnonce();
  }

  loadAnnonce(): void {
    this.isLoading.set(true);
    this.annonceService.getById(this.annonceId()).subscribe({
      next: (data) => {
        this.annonce.set(data);
        this.photos.set(data.photos || []);
        this.form.patchValue({
          titre: data.titre,
          prix: data.prix,
          montant_reservation: data.montant_reservation,
          kilometrage: data.vehicule?.kilometrage,
          statut_douanier: data.vehicule?.statut_douanier,
          ville: data.ville,
          description: data.description,
          statut: data.statut,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement de l\'annonce.');
        this.isLoading.set(false);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.uploadError.set('Format invalide. JPG, PNG ou WebP uniquement.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.uploadError.set('Image trop lourde. Maximum 5MB.');
      return;
    }

    this.uploadError.set('');
    this.isUploadingPhoto.set(true);

    this.cloudinaryService.uploadImage(file).subscribe({
      next: (res) => {
        this.photos.update(p => [...p, res.secure_url]);
        this.isUploadingPhoto.set(false);
      },
      error: () => {
        this.uploadError.set('Erreur lors de l\'upload. Réessayez.');
        this.isUploadingPhoto.set(false);
      }
    });
  }

  removePhoto(index: number): void {
    if (this.photos().length <= 1) {
      this.errorMessage.set('Vous devez garder au moins une photo.');
      return;
    }
    this.photos.update(p => p.filter((_, i) => i !== index));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (this.photos().length === 0) {
      this.errorMessage.set('Au moins une photo est requise.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = {
      ...this.form.value,
      photos: this.photos()
    };

    this.annonceService.update(this.annonceId(), payload).subscribe({
      next: () => {
        this.successMessage.set('Annonce modifiée avec succès !');
        this.isSaving.set(false);
        setTimeout(() => {
          this.router.navigate(['/vendeur/mes-annonces', this.annonceId()]);
        }, 1500);
      },
      error: (err) => {
        this.isSaving.set(false);
        if (err.error?.errors) {
          const firstError = Object.values(err.error.errors)[0] as string[];
          this.errorMessage.set(firstError[0]);
        } else {
          this.errorMessage.set(err.error?.message || 'Une erreur est survenue.');
        }
      }
    });
  }
}
