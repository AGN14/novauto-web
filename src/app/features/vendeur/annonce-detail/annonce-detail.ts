import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnnonceService } from '../../../core/services/annonce';
import { LucideAngularModule, ArrowLeft, Edit, Trash2, Eye, Calendar, Gauge, Shield, CheckCircle, Copy, MapPin } from 'lucide-angular';

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

  annonce = signal<any>(null);
  isLoading = signal(true);
  photoActive = signal(0);
  vinCopied = signal(false);
  deleteConfirm = signal(false);
  isDeleting = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annonceService: AnnonceService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.annonceService.getById(+id).subscribe({
      next: (data) => {
        this.annonce.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
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