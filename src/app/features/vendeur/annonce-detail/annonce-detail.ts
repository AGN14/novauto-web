import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnonceService } from '../../../core/services/annonce';
import { InspectionService } from '../../../core/services/inspection.service';
import { AvisService } from '../../../core/services/avis.service';
import { StarRating } from '../../../shared/components/star-rating/star-rating';
import { LucideAngularModule, ArrowLeft, Edit, Trash2, Eye, Calendar, Gauge, Shield, CheckCircle, Copy, MapPin, ShieldCheck, AlertTriangle, Clock, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-vendeur-annonce-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule, StarRating],
  templateUrl: './annonce-detail.html',
  styleUrl: './annonce-detail.css'
})
export class VendeurAnnonceDetail implements OnInit {

  readonly ArrowLeft = ArrowLeft;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Eye = Eye;
  readonly Calendar = Calendar;
  readonly Gauge = Gauge;
  readonly Shield = Shield;
  readonly CheckCircle = CheckCircle;
  readonly Copy = Copy;
  readonly MapPin = MapPin;
  readonly ShieldCheck = ShieldCheck;
  readonly AlertTriangle = AlertTriangle;
  readonly Clock = Clock;
  readonly AlertCircle = AlertCircle;

  annonce = signal<any>(null);
  isLoading = signal(true);
  photoActive = signal(0);
  vinCopied = signal(false);
  deleteConfirm = signal(false);
  isDeleting = signal(false);

  // Certification
  inspections = signal<any[]>([]);
  isLoadingInspections = signal(true);

  // Confirmation présence
  codePresence = signal('');
  isConfirmingPresence = signal(false);
  presenceError = signal('');

  // Avis
  avis = signal<any[]>([]);
  isLoadingAvis = signal(true);
  signalementModal = signal<{ visible: boolean, avisId: number | null, raison: string }>({
    visible: false,
    avisId: null,
    raison: ''
  });
  isSubmittingSignalement = signal(false);
  signalementMessage = signal<{ type: 'success' | 'error', text: string } | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annonceService: AnnonceService,
    private inspectionService: InspectionService,
    private avisService: AvisService
  ) {}

  ngOnInit(): void {
    // Écouter les changements de paramètres pour recharger les données
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadData(id);
    });
  }

  loadData(id: number): void {
    this.isLoading.set(true);
    this.isLoadingInspections.set(true);
    this.isLoadingAvis.set(true);

    // Charger l'annonce
    this.annonceService.getById(id).subscribe({
      next: (data) => {
        this.annonce.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });

    // Charger les inspections pour cette annonce
    this.loadInspections(id);

    // Charger les avis pour cette annonce
    this.loadAvis(id);
  }

  loadInspections(annonceId: number): void {
    this.inspectionService.getMesInspections().subscribe({
      next: (data) => {
        // Filtrer par annonce_id (pas vehicule_id)
        const inspectionsAnnonce = data.filter((i: any) => i.annonce_id === annonceId);
        this.inspections.set(inspectionsAnnonce);
        this.isLoadingInspections.set(false);
      },
      error: () => this.isLoadingInspections.set(false)
    });
  }

  getInspectionActive(): any {
    return this.inspections().find((i: any) =>
      i.statut === 'EN_ATTENTE' || i.statut === 'EN_COURS' || i.statut === 'VALIDEE'
    );
  }

  hasInspectionEnCours(): boolean {
    const inspection = this.getInspectionActive();
    return inspection?.statut === 'EN_ATTENTE' || inspection?.statut === 'EN_COURS';
  }

  hasInspectionValidee(): boolean {
    const inspection = this.getInspectionActive();
    return inspection?.statut === 'VALIDEE';
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  getStatutDouanier(): string {
    return this.annonce()?.vehicule?.statut_douanier === 'DEDOUANE' ? 'DÉDOUANÉ' : 'EN TRANSIT';
  }

  getStatutClass(): string {
    switch (this.annonce()?.statut) {
      case 'DISPONIBLE': return 'badge-success';
      case 'RESERVEE':   return 'badge-gold';
      case 'VENDUE':     return 'badge-muted';
      default:           return 'badge-muted';
    }
  }

  setPhotoActive(index: number): void {
    this.photoActive.set(index);
  }

  copyVin(): void {
    const vin = this.annonce()?.vehicule?.vin;
    if (vin) {
      navigator.clipboard.writeText(vin);
      this.vinCopied.set(true);
      setTimeout(() => this.vinCopied.set(false), 2000);
    }
  }

  deleteAnnonce(): void {
    this.isDeleting.set(true);
    this.annonceService.delete(this.annonce().id).subscribe({
      next: () => this.router.navigate(['/vendeur/mes-annonces']),
      error: () => this.isDeleting.set(false)
    });
  }

  loadAvis(annonceId: number): void {
    this.avisService.getAvisByAnnonce(annonceId).subscribe({
      next: (data) => {
        this.avis.set(data);
        this.isLoadingAvis.set(false);
      },
      error: () => this.isLoadingAvis.set(false)
    });
  }

  getNoteMoyenne(): number {
    const avisList = this.avis();
    if (avisList.length === 0) return 0;
    const sum = avisList.reduce((acc: number, a: any) => acc + a.note, 0);
    return Math.round((sum / avisList.length) * 10) / 10;
  }

  openSignalementModal(avisId: number): void {
    this.signalementModal.set({ visible: true, avisId, raison: '' });
  }

  closeSignalementModal(): void {
    this.signalementModal.set({ visible: false, avisId: null, raison: '' });
    this.signalementMessage.set(null);
  }

  soumettreSignalement(): void {
    const modal = this.signalementModal();
    if (!modal.avisId || !modal.raison.trim()) return;

    this.isSubmittingSignalement.set(true);
    this.avisService.signalerAvis(modal.avisId, modal.raison).subscribe({
      next: () => {
        this.isSubmittingSignalement.set(false);
        this.signalementMessage.set({ type: 'success', text: 'Avis signalé avec succès. L\'administrateur examinera votre demande.' });
        // Recharger les avis pour mettre à jour l'affichage
        this.loadAvis(this.annonce().id);
        setTimeout(() => this.closeSignalementModal(), 2000);
      },
      error: (err) => {
        this.isSubmittingSignalement.set(false);
        this.signalementMessage.set({ type: 'error', text: err.error?.message || 'Erreur lors du signalement' });
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  confirmerMaPresence(): void {
    const inspection = this.getInspectionActive();
    const code = this.codePresence().toUpperCase().trim();

    if (!inspection || !code) {
      this.presenceError.set('Veuillez entrer le code de présence');
      return;
    }

    if (code.length !== 6) {
      this.presenceError.set('Le code doit contenir 6 caractères');
      return;
    }

    this.isConfirmingPresence.set(true);
    this.presenceError.set('');

    this.inspectionService.confirmerPresence(inspection.id, code).subscribe({
      next: () => {
        this.isConfirmingPresence.set(false);
        this.codePresence.set('');
        // Recharger les inspections pour voir le changement
        this.loadInspections(this.annonce().id);
      },
      error: (err) => {
        this.isConfirmingPresence.set(false);
        this.presenceError.set(err.error?.message || 'Code incorrect ou expiré');
      }
    });
  }

  onCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6);
    this.codePresence.set(value);
    input.value = value;
  }
}