import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { AnnonceService } from '../../../core/services/annonce';
import { PaiementService } from '../../../core/services/paiement.service';
import { DisponibiliteService } from '../../../core/services/disponibilite.service';
import { LucideAngularModule, ArrowLeft, CreditCard, AlertCircle, CheckCircle } from 'lucide-angular';
import { Disponibilite } from '../../../core/models/rendez-vous.model';
import { CalendarDisponibilites } from '../../../shared/components/calendar-disponibilites/calendar-disponibilites';
import { CreneauxHoraires } from '../../../shared/components/creneaux-horaires/creneaux-horaires';

@Component({
  selector: 'app-nouvelle-reservation',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, CalendarDisponibilites, CreneauxHoraires],
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

  // Disponibilités
  disponibilites: Disponibilite[] = [];
  selectedDate: Date | null = null;
  selectedDateDisponibilites: Disponibilite[] = [];
  selectedDisponibilite: Disponibilite | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private annonceService: AnnonceService,
    private paiementService: PaiementService,
    private disponibiliteService: DisponibiliteService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.annonceId.set(+id);
      this.loadAnnonce();
      this.loadDisponibilites();
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

  loadDisponibilites(): void {
    this.disponibiliteService.getDisponibilitesAnnonce(this.annonceId()).subscribe({
      next: (data) => {
        this.disponibilites = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des disponibilités:', err);
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
    if (!this.selectedDisponibilite) {
      this.errorMessage.set('Veuillez sélectionner un créneau disponible.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    // Préparer les données du créneau sélectionné
    const dateRdv = this.selectedDisponibilite.jour;
    const heureRdv = this.selectedDisponibilite.heure_debut;

    // Étape 1: Créer la réservation
    this.reservationService.creerReservation(this.annonceId(), dateRdv, heureRdv).subscribe({
      next: (reservation) => {
        console.log('Réservation créée:', reservation);

        // Étape 2: Initier le paiement FedaPay
        this.paiementService.initierPaiement(reservation.id).subscribe({
          next: (paiement) => {
            console.log('Paiement initié:', paiement);

            // Sauvegarder l'ID de réservation pour retour
            sessionStorage.setItem('pending_reservation_id', reservation.id.toString());

            // Rediriger vers FedaPay (redirection complète pour meilleure compatibilité mobile)
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

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.updateSelectedDateDisponibilites();
    this.selectedDisponibilite = null;
  }

  private updateSelectedDateDisponibilites(): void {
    if (!this.selectedDate) {
      this.selectedDateDisponibilites = [];
      return;
    }

    const dateString = this.formatDate(this.selectedDate);
    this.selectedDateDisponibilites = this.disponibilites.filter(d => d.jour === dateString);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onCreneauSelected(disponibilite: Disponibilite): void {
    this.selectedDisponibilite = disponibilite;
    this.errorMessage.set(null);
  }
}
