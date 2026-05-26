import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AnnonceService } from '../../../core/services/annonce';
import { VinService } from '../../../core/services/vin';
import { CloudinaryService } from '../../../core/services/cloudinary.service';
import { LucideAngularModule, Search, CheckCircle, AlertTriangle, Trash2, Plus, Car, MapPin, RotateCcw } from 'lucide-angular';

@Component({
  selector: 'app-nouvelle-annonce',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, LucideAngularModule],
  templateUrl: './nouvelle-annonce.html',
  styleUrl: './nouvelle-annonce.css'
})
export class NouvelleAnnonce implements OnInit {

  readonly Search = Search;
  readonly CheckCircle = CheckCircle;
  readonly AlertTriangle = AlertTriangle;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;
  readonly Car = Car;
  readonly MapPin = MapPin;
  readonly RotateCcw = RotateCcw;

  // VIN
  vinInput = signal('');
  vinLoading = signal(false);
  vinVerifie = signal(false);
  vinError = signal('');
  vinData = signal<any>(null);

  // Form
  form: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  isPublished = signal(false);

  // Photos
  photos = signal<{ url: string; angle: string; uploading: boolean }[]>([]);
  newPhotoAngle = signal('AVANT');
  uploadError = signal('');

  angles = [
    { value: 'AVANT', label: 'Avant', required: true },
    { value: 'ARRIERE', label: 'Arrière', required: true },
    { value: 'COTE_GAUCHE', label: 'Côté gauche', required: true },
    { value: 'COTE_DROIT', label: 'Côté droit', required: true },
    { value: 'INTERIEUR', label: 'Intérieur', required: false },
    { value: 'TABLEAU_BORD', label: 'Tableau de bord', required: false },
    { value: 'MOTEUR', label: 'Moteur', required: false },
    { value: 'AUTRE', label: 'Autre', required: false },
  ];

  equipements = [
    { key: 'climatisation', label: 'Climatisation' },
    { key: 'toit_ouvrant', label: 'Toit ouvrant' },
    { key: 'sieges_cuir', label: 'Sièges en cuir' },
    { key: 'camera_recul', label: 'Caméra de recul' },
    { key: 'gps', label: 'GPS Navigation' },
    { key: 'bluetooth', label: 'Bluetooth' },
    { key: 'abs', label: 'Freins ABS' },
    { key: 'airbags', label: 'Airbags' },
    { key: 'regulateur', label: 'Régulateur de vitesse' },
    { key: 'radar', label: 'Radar de stationnement' },
    { key: 'jantes', label: 'Jantes alliage' },
    { key: 'vitres_electriques', label: 'Vitres électriques' },
  ];

  selectedEquipements = signal<string[]>([]);

  villes = ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Bohicon', 'Natitingou', 'Ouidah'];

  annees = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  photosRequises = computed(() => {
    const anglesRequis = ['AVANT', 'ARRIERE', 'COTE_GAUCHE', 'COTE_DROIT'];
    return anglesRequis.every(angle =>
      this.photos().some(p => p.angle === angle && !p.uploading)
    );
  });

  constructor(
    private fb: FormBuilder,
    private annonceService: AnnonceService,
    private vinService: VinService,
    private cloudinaryService: CloudinaryService,
    private router: Router
  ) {
    this.form = this.fb.group({
      titre:               ['', [Validators.required, Validators.minLength(10)]],
      prix:                ['', [Validators.required, Validators.min(1)]],
      montant_reservation: ['', [Validators.required, Validators.min(10000)]],
      kilometrage:         ['', [Validators.required, Validators.min(0)]],
      statut_douanier:     ['DEDOUANE', [Validators.required]],
      ville:               ['Cotonou', [Validators.required]],
      description:         [''],
      annee:               ['', [Validators.required]],
      vin:                 ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
    });
  }

  ngOnInit(): void {}

  onVinInput(event: any): void {
    const val = event.target.value.toUpperCase();
    this.vinInput.set(val);
    this.form.get('vin')?.setValue(val);
    if (val.length < 17) {
      this.vinVerifie.set(false);
      this.vinData.set(null);
      this.form.get('modele_id')?.setValue('');
      this.form.get('annee')?.setValue('');
    }
  }

  verifierVin(): void {
    const vin = this.vinInput();
    if (vin.length !== 17) {
      this.vinError.set('Le VIN doit contenir exactement 17 caractères.');
      return;
    }

    this.vinLoading.set(true);
    this.vinError.set('');

    this.vinService.decodeVin(vin).subscribe({
      next: (data) => {
        if (!data.marque) {
          this.vinError.set('VIN invalide ou non reconnu.');
          this.vinLoading.set(false);
          return;
        }
        this.vinData.set(data);
        this.vinVerifie.set(true);
        this.vinLoading.set(false);

        if (data.marque && data.annee) {
          // Construire un titre complet avec les infos disponibles
          let titre = `${data.marque}`;

          if (data.modele) {
            titre += ` ${data.modele}`;
          }

          titre += ` ${data.annee}`;

          if (data.carburant) {
            titre += ` - ${data.carburant}`;
          }

          if (data.transmission) {
            titre += ` - ${data.transmission}`;
          }

          titre += ' - Excellent état';

          this.form.get('titre')?.setValue(titre);

          // Remplir l'année (requis)
          const anneeNumber = parseInt(data.annee, 10);
          this.form.get('annee')?.setValue(anneeNumber);

          // Marquer les champs comme touchés pour éviter les erreurs de validation
          this.form.get('annee')?.markAsTouched();
          this.form.get('titre')?.markAsTouched();
        }
      },
      error: () => {
        this.vinError.set('Erreur de connexion. Réessayez.');
        this.vinLoading.set(false);
      }
    });
  }

  onFileSelected(event: any, angle: string): void {
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

    const index = this.photos().length;
    this.photos.update(p => [...p, { url: '', angle, uploading: true }]);

    this.cloudinaryService.uploadImage(file).subscribe({
      next: (res) => {
        this.photos.update(p => p.map((photo, i) =>
          i === index ? { url: res.secure_url, angle, uploading: false } : photo
        ));
      },
      error: () => {
        this.photos.update(p => p.filter((_, i) => i !== index));
        this.uploadError.set('Erreur lors de l\'upload. Réessayez.');
      }
    });
  }

  toggleEquipement(key: string): void {
    this.selectedEquipements.update(list => {
      if (list.includes(key)) return list.filter(k => k !== key);
      return [...list, key];
    });
  }

  isEquipementSelected(key: string): boolean {
    return this.selectedEquipements().includes(key);
  }

  removePhoto(index: number): void {
    this.photos.update(p => p.filter((_, i) => i !== index));
  }

  getAngleLabel(angle: string): string {
    return this.angles.find(a => a.value === angle)?.label || angle;
  }

  onSubmit(): void {
  console.log('Form valid:', this.form.valid);
  console.log('Form values:', this.form.value);
  Object.keys(this.form.controls).forEach(key => {
    const control = this.form.get(key);
    console.log(`${key}:`, control?.value, '| valid:', control?.valid, '| errors:', control?.errors);
  });

  if (this.form.invalid) {
    this.form.markAllAsTouched();

    // Identifier les champs invalides
    const invalidFields = Object.keys(this.form.controls)
      .filter(key => this.form.get(key)?.invalid)
      .map(key => key.replace('_', ' '));

    this.errorMessage.set(`Champs invalides: ${invalidFields.join(', ')}`);
    return;
  }

  if (!this.vinVerifie()) {
    this.errorMessage.set('Veuillez vérifier le VIN avant de publier.');
    return;
  }

  if (this.photos().length < 5) {
    this.errorMessage.set('Minimum 5 photos requises.');
    return;
  }

  if (!this.photosRequises()) {
    this.errorMessage.set('Les 4 angles obligatoires (Avant, Arrière, Côté gauche, Côté droit) sont requis.');
    return;
  }

  this.isLoading.set(true);
  this.errorMessage.set('');

  const payload = {
    ...this.form.value,
    photos: this.photos().map(p => p.url),
    equipements: this.selectedEquipements(),
    // Ajouter les données VIN si disponibles
    ...(this.vinData() && {
      marque: this.vinData().marque,
      modele: this.vinData().modele,
      carburant: this.vinData().carburant,
      transmission: this.vinData().transmission,
      pays_origine: this.vinData().pays_origine,
    })
  };

  console.log('Payload envoyé:', payload);
  console.log('Photos URLs:', this.photos().map(p => p.url));
  console.log('VIN Data:', this.vinData());

  this.annonceService.create(payload).subscribe({
    next: () => {
      this.isLoading.set(false);
      this.successMessage.set('Annonce publiée avec succès !');
      this.isPublished.set(true);
    },
    error: (err) => {
      this.isLoading.set(false);
      console.error('=== ERREUR DÉTAILLÉE ===');
      console.error('Status:', err.status);
      console.error('Message:', err.message);
      console.error('Error object:', err.error);
      console.error('Errors details:', err.error?.errors);
      console.error('=======================');

      if (err.error?.errors) {
        // Afficher toutes les erreurs
        const errorMessages = Object.entries(err.error.errors)
          .map(([field, messages]: [string, any]) => `${field}: ${messages[0]}`)
          .join('\n');
        this.errorMessage.set(errorMessages);
      } else {
        this.errorMessage.set(err.error?.message || 'Une erreur est survenue. Réessayez.');
      }
    }
  });
  }
}