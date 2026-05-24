import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { AnnonceService } from '../../../core/services/annonce';
import { PaiementService } from '../../../core/services/paiement.service';
import { LucideAngularModule, ArrowLeft, CreditCard, AlertCircle, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-nouvelle-reservation',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './nouvelle-reservation.html',
  styleUrl: './nouvelle-reservation.css'
})
export class NouvelleReservation implements OnInit {
  readonly ArrowLeft = ArrowLeft;
  readonly CreditCard = CreditCard;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;

  annonceId = signal<number>(0);
  annonce = signal<any>(null);
  isLoading = signal(true);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  // Calendrier
  currentMonth = signal<Date>(new Date());
  selectedDate = signal<Date | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private annonceService: AnnonceService,
    private paiementService: PaiementService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.annonceId.set(+id);
      this.loadAnnonce();
    }
  }

  loadAnnonce(): void {
    this.annonceService.getById(this.annonceId()).subscribe({
      next: (data: any) => {
        this.annonce.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de charger l\'annonce.');
      }
    });
  }

  getMontantReservation(): number {
    if (this.annonce()?.montant_reservation) {
      return this.annonce().montant_reservation;
    }
    return this.annonce()?.prix * 0.10;
  }

  confirmerReservation(): void {
    if (!this.selectedDate()) {
      this.errorMessage.set('Veuillez sélectionner une date de visite.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    // Étape 1: Créer la réservation
    this.reservationService.creerReservation(this.annonceId()).subscribe({
      next: (reservation) => {
        console.log('Réservation créée:', reservation);

        // Étape 2: Initier le paiement FedaPay
        this.paiementService.initierPaiement(reservation.id).subscribe({
          next: (paiement) => {
            console.log('Paiement initié:', paiement);

            // Rediriger vers FedaPay
            window.location.href = paiement.payment_url;
          },
          error: (err) => {
            console.error('Erreur initiation paiement:', err);
            this.isSubmitting.set(false);
            this.errorMessage.set('Erreur lors de l\'initialisation du paiement. Veuillez réessayer.');
          }
        });
      },
      error: (err) => {
        console.error('Erreur création réservation:', err);
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Une erreur est survenue lors de la création de la réservation.');
      }
    });
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  // Calendrier
  getDaysInMonth(): Date[] {
    const year = this.currentMonth().getFullYear();
    const month = this.currentMonth().getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) {
      days.push(new Date(0));
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  }

  previousMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  selectDate(date: Date): void {
    if (date.getTime() === 0 || this.isPastDate(date)) return;
    this.selectedDate.set(date);
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  isSelectedDate(date: Date): boolean {
    if (!this.selectedDate() || date.getTime() === 0) return false;
    return date.toDateString() === this.selectedDate()!.toDateString();
  }

  getMonthName(): string {
    return this.currentMonth().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }
}
