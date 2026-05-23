import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { AnnonceService } from '../../../core/services/annonce';
import { ReservationService } from '../../../core/services/reservation.service';
import { AvisService } from '../../../core/services/avis.service';
import { AuthService } from '../../../core/services/auth.service';
import { StarRating } from '../../../shared/components/star-rating/star-rating';
import { LucideAngularModule, ArrowLeft, MapPin, Calendar, Gauge, Shield, CheckCircle, Copy, AlertTriangle, Star, MessageCircle } from 'lucide-angular';

@Component({
  selector: 'app-annonce-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule, StarRating],
  templateUrl: './annonce-detail.html',
  styleUrl: './annonce-detail.css'
})
export class AnnonceDetail implements OnInit, OnDestroy {

  readonly ArrowLeft = ArrowLeft;
  readonly MapPin = MapPin;
  readonly Calendar = Calendar;
  readonly Gauge = Gauge;
  readonly Shield = Shield;
  readonly CheckCircle = CheckCircle;
  readonly Copy = Copy;
  readonly AlertTriangle = AlertTriangle;
  readonly Star = Star;
  readonly MessageCircle = MessageCircle;

  annonce = signal<any>(null);
  isLoading = signal(true);
  photoActive = signal(0);
  vinCopied = signal(false);

  // Réservation
  reservationActive = signal<any | null>(null);
  isLoadingReservation = signal(true);

  // Avis
  avis = signal<any[]>([]);
  noteFormulaire = signal(0);
  commentaireFormulaire = signal('');
  isSubmittingAvis = signal(false);
  avisSuccess = signal(false);
  avisError = signal('');
  isLoadingAvis = signal(true);

  private routerSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annonceService: AnnonceService,
    private reservationService: ReservationService,
    private avisService: AvisService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadAnnonce(+id);
    this.loadAvis(+id);
    this.loadReservation(+id);

    // Écouter les événements de navigation pour recharger les réservations
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Si on revient sur cette page, recharger les réservations
        if (event.url.includes(`/catalogue/${id}`)) {
          this.loadReservation(+id);
        }
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  private loadAnnonce(id: number): void {
    this.annonceService.getById(id).subscribe({
      next: (data) => {
        this.annonce.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  private loadAvis(id: number): void {
    this.avisService.getAvisByAnnonce(id).subscribe({
      next: (data) => {
        this.avis.set(data);
        this.isLoadingAvis.set(false);
      },
      error: () => this.isLoadingAvis.set(false)
    });
  }

  private loadReservation(id: number): void {
    if (this.authService.isAcheteur()) {
      this.isLoadingReservation.set(true);
      this.reservationService.getMesReservations().subscribe({
        next: (data) => {
          // Trouver la réservation active pour cette annonce (EN_ATTENTE ou CONFIRMEE, pas ANNULEE)
          const reservation = data.find((r: any) =>
            r.annonce_id === id &&
            (r.statut === 'EN_ATTENTE' || r.statut === 'CONFIRMEE')
          );
          this.reservationActive.set(reservation || null);
          this.isLoadingReservation.set(false);
        },
        error: () => this.isLoadingReservation.set(false)
      });
    } else {
      this.isLoadingReservation.set(false);
    }
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  getStatutDouanier(): string {
    return this.annonce()?.vehicule?.statut_douanier === 'DEDOUANE' ? 'DÉDOUANÉ' : 'EN TRANSIT';
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

  // États de la réservation
  hasReservationActive(): boolean {
    return !!this.reservationActive();
  }

  isVehiculeNonDisponible(): boolean {
    const annonce = this.annonce();
    return annonce && (annonce.statut === 'RESERVEE' || annonce.statut === 'VENDUE');
  }

  onNoteChange(note: number): void {
    this.noteFormulaire.set(note);
  }

  soumettreAvis(): void {
    if (this.noteFormulaire() === 0) {
      this.avisError.set('Veuillez sélectionner une note.');
      return;
    }

    this.isSubmittingAvis.set(true);
    this.avisError.set('');

    this.avisService.soumettre({
      annonce_id: this.annonce().id,
      note: this.noteFormulaire(),
      commentaire: this.commentaireFormulaire() || undefined,
    }).subscribe({
      next: () => {
        this.isSubmittingAvis.set(false);
        this.avisSuccess.set(true);
        this.noteFormulaire.set(0);
        this.commentaireFormulaire.set('');
      },
      error: (err) => {
        this.isSubmittingAvis.set(false);
        this.avisError.set(err.error?.message || 'Une erreur est survenue.');
      }
    });
  }

  getNoteMoyenne(): number {
    if (this.avis().length === 0) return 0;
    const sum = this.avis().reduce((acc, a) => acc + a.note, 0);
    return Math.round((sum / this.avis().length) * 10) / 10;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}