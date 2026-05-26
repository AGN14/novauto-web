import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { RendezVousService } from '../../../core/services/rendez-vous.service';
import { AnnonceService } from '../../../core/services/annonce';
import { LucideAngularModule, Calendar, ShoppingCart, Eye, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight, TrendingUp } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  readonly Calendar = Calendar;
  readonly ShoppingCart = ShoppingCart;
  readonly Eye = Eye;
  readonly Clock = Clock;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly AlertCircle = AlertCircle;
  readonly ArrowRight = ArrowRight;
  readonly TrendingUp = TrendingUp;

  reservations = signal<any[]>([]);
  rendezVous = signal<any[]>([]);
  annonces = signal<any[]>([]);
  isLoadingReservations = signal(true);
  isLoadingRdv = signal(true);
  isLoadingAnnonces = signal(true);

  stats = signal({
    reservationsEnCours: 0,
    rdvAVenir: 0,
    totalDepense: 0,
    annoncesFavorites: 0
  });

  constructor(
    private reservationService: ReservationService,
    private rendezVousService: RendezVousService,
    private annonceService: AnnonceService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    this.loadRendezVous();
    this.loadAnnonces();
  }

  loadReservations(): void {
    this.isLoadingReservations.set(true);
    this.reservationService.getMesReservations().subscribe({
      next: (data) => {
        this.reservations.set(data);
        this.calculateStats();
        this.isLoadingReservations.set(false);
      },
      error: () => this.isLoadingReservations.set(false)
    });
  }

  loadRendezVous(): void {
    this.isLoadingRdv.set(true);
    this.rendezVousService.getMesRendezVous().subscribe({
      next: (data) => {
        this.rendezVous.set(data);
        this.calculateStats();
        this.isLoadingRdv.set(false);
      },
      error: () => this.isLoadingRdv.set(false)
    });
  }

  loadAnnonces(): void {
    this.isLoadingAnnonces.set(true);
    this.annonceService.getAll({ per_page: 4 }).subscribe({
      next: (data) => {
        this.annonces.set(data.data || data);
        this.isLoadingAnnonces.set(false);
      },
      error: () => this.isLoadingAnnonces.set(false)
    });
  }

  calculateStats(): void {
    const reservationsEnCours = this.reservations().filter(r => r.statut === 'EN_ATTENTE').length;
    const rdvAVenir = this.rendezVous().filter(r => r.statut === 'CONFIRME' && new Date(r.date_rdv) > new Date()).length;
    const totalDepense = this.reservations().reduce((sum, r) => sum + (r.montant_paye || 0), 0);

    this.stats.set({
      reservationsEnCours,
      rdvAVenir,
      totalDepense,
      annoncesFavorites: 0
    });
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  getStatutBadgeClass(statut: string): string {
    const mapping: { [key: string]: string } = {
      'EN_ATTENTE': 'badge-warning',
      'CONFIRMEE': 'badge-success',
      'ANNULEE': 'badge-danger',
      'CONFIRME': 'badge-success',
      'PROPOSE': 'badge-info',
      'REFUSE': 'badge-danger'
    };
    return mapping[statut] || 'badge-default';
  }

  getStatutLabel(statut: string): string {
    const mapping: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'CONFIRMEE': 'Confirmée',
      'ANNULEE': 'Annulée',
      'CONFIRME': 'Confirmé',
      'PROPOSE': 'Proposé',
      'REFUSE': 'Refusé'
    };
    return mapping[statut] || statut;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
