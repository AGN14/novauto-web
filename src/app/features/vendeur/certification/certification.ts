import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InspectionService } from '../../../core/services/inspection.service';
import { AnnonceService } from '../../../core/services/annonce';
import { LucideAngularModule, ArrowLeft, ShieldCheck, CheckCircle, Clock, AlertTriangle, MapPin, Phone } from 'lucide-angular';

@Component({
  selector: 'app-certification',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './certification.html',
  styleUrl: './certification.css'
})
export class Certification implements OnInit {

  readonly ArrowLeft = ArrowLeft;
  readonly ShieldCheck = ShieldCheck;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly AlertTriangle = AlertTriangle;
  readonly MapPin = MapPin;
  readonly Phone = Phone;

  annonce = signal<any>(null);
  garages = signal<any[]>([]);
  inspections = signal<any[]>([]);
  selectedGarage = signal<number | null>(null);

  isLoadingAnnonce = signal(true);
  isLoadingGarages = signal(true);
  isLoadingInspections = signal(true);
  isSendingInspection = signal(false);

  inspectionSuccess = signal(false);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annonceService: AnnonceService,
    private inspectionService: InspectionService
  ) {}

  ngOnInit(): void {
    const annonceId = +this.route.snapshot.params['id'];

    // Charger l'annonce
    this.annonceService.getById(annonceId).subscribe({
      next: (data) => {
        this.annonce.set(data);
        this.isLoadingAnnonce.set(false);
      },
      error: () => {
        this.isLoadingAnnonce.set(false);
        this.errorMessage.set('Impossible de charger l\'annonce.');
      }
    });

    // Charger les garages
    this.inspectionService.getGarages().subscribe({
      next: (data) => {
        this.garages.set(data);
        this.isLoadingGarages.set(false);
      },
      error: () => {
        this.isLoadingGarages.set(false);
      }
    });

    // Charger les inspections existantes
    this.inspectionService.getMesInspections().subscribe({
      next: (data) => {
        // Filtrer pour cette annonce
        const inspectionsAnnonce = data.filter((i: any) => i.annonce_id === annonceId);
        this.inspections.set(inspectionsAnnonce);
        this.isLoadingInspections.set(false);
      },
      error: () => {
        this.isLoadingInspections.set(false);
      }
    });
  }

  selectGarage(garageId: number): void {
    this.selectedGarage.set(garageId);
    this.errorMessage.set('');
  }

  demanderInspection(): void {
    if (!this.selectedGarage()) {
      this.errorMessage.set('Veuillez sélectionner un garage.');
      return;
    }

    this.isSendingInspection.set(true);
    this.errorMessage.set('');

    this.inspectionService.demanderInspection(
      this.annonce()!.id,
      this.selectedGarage()!
    ).subscribe({
      next: () => {
        this.isSendingInspection.set(false);
        this.inspectionSuccess.set(true);
      },
      error: (err) => {
        this.isSendingInspection.set(false);
        this.errorMessage.set(err.error?.message || 'Une erreur est survenue lors de l\'envoi de la demande.');
      }
    });
  }

  hasActiveInspection(): boolean {
    return this.inspections().some((i: any) =>
      i.statut === 'EN_ATTENTE' || i.statut === 'VALIDEE'
    );
  }

  getActiveInspection(): any {
    return this.inspections().find((i: any) =>
      i.statut === 'EN_ATTENTE' || i.statut === 'VALIDEE'
    );
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente de validation';
      case 'VALIDEE': return 'Validée';
      case 'REFUSEE': return 'Refusée';
      default: return statut;
    }
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'statut-pending';
      case 'VALIDEE': return 'statut-success';
      case 'REFUSEE': return 'statut-error';
      default: return 'statut-pending';
    }
  }

  retourAnnonce(): void {
    this.router.navigate(['/vendeur/mes-annonces', this.annonce()?.id]);
  }
}
