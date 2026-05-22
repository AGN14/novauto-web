import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnnonceService } from '../../../core/services/annonce';
import { InspectionService } from '../../../core/services/inspection.service';
import { LucideAngularModule, ArrowLeft, Edit, Trash2, Eye, Calendar, Gauge, Shield, CheckCircle, Copy, MapPin, ShieldCheck } from 'lucide-angular';

@Component({
  selector: 'app-vendeur-annonce-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
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

  annonce = signal<any>(null);
  isLoading = signal(true);
  photoActive = signal(0);
  vinCopied = signal(false);
  deleteConfirm = signal(false);
  isDeleting = signal(false);

  // Certification
  inspections = signal<any[]>([]);
  isLoadingInspections = signal(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annonceService: AnnonceService,
    private inspectionService: InspectionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    // Charger l'annonce
    this.annonceService.getById(+id).subscribe({
      next: (data) => {
        this.annonce.set(data);
        this.isLoading.set(false);

        // Charger les inspections pour ce véhicule
        if (data.vehicule?.id) {
          this.loadInspections(data.vehicule.id);
        }
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadInspections(vehiculeId: number): void {
    this.inspectionService.getMesInspections().subscribe({
      next: (data) => {
        // Filtrer par vehicule_id de l'annonce courante
        const inspectionsVehicule = data.filter((i: any) => i.vehicule_id === vehiculeId);
        this.inspections.set(inspectionsVehicule);
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
}