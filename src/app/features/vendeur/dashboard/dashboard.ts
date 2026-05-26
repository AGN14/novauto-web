import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnnonceService } from '../../../core/services/annonce';
import { AuthService } from '../../../core/services/auth.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { LucideAngularModule, Car, Plus, TrendingUp, Eye, Edit, Trash2, Smile, ShoppingCart, Calendar, CheckCircle, ArrowRight, Clock, Package } from 'lucide-angular';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  readonly Car = Car;
  readonly Plus = Plus;
  readonly TrendingUp = TrendingUp;
  readonly Eye = Eye;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Smile = Smile;
  readonly ShoppingCart = ShoppingCart;
  readonly Calendar = Calendar;
  readonly CheckCircle = CheckCircle;
  readonly ArrowRight = ArrowRight;
  readonly Clock = Clock;
  readonly Package = Package;

  annonces = signal<any[]>([]);
  reservations = signal<any[]>([]);
  isLoadingAnnonces = signal(true);
  isLoadingReservations = signal(true);

  constructor(
    private annonceService: AnnonceService,
    private reservationService: ReservationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAnnonces();
    this.loadReservations();
  }

  loadAnnonces(): void {
    this.isLoadingAnnonces.set(true);
    this.annonceService.getMesAnnonces().subscribe({
      next: (data) => {
        this.annonces.set(data);
        this.isLoadingAnnonces.set(false);
      },
      error: () => this.isLoadingAnnonces.set(false)
    });
  }

  loadReservations(): void {
    this.isLoadingReservations.set(true);
    this.reservationService.getVendeurReservations().subscribe({
      next: (data) => {
        this.reservations.set(data);
        this.isLoadingReservations.set(false);
      },
      error: () => this.isLoadingReservations.set(false)
    });
  }

  get totalAnnonces() { return this.annonces().length; }
  get annoncesDisponibles() { return this.annonces().filter(a => a.statut === 'DISPONIBLE').length; }
  get annoncesReservees() { return this.annonces().filter(a => a.statut === 'RESERVEE').length; }
  get annoncesVendues() { return this.annonces().filter(a => a.statut === 'VENDUE').length; }
  get reservationsEnAttente() { return this.reservations().filter(r => r.statut === 'EN_ATTENTE').length; }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'DISPONIBLE': return 'badge badge-success';
      case 'RESERVEE':   return 'badge badge-warning';
      case 'VENDUE':     return 'badge badge-default';
      default:           return 'badge badge-default';
    }
  }

  getStatutBadgeClass(statut: string): string {
    const mapping: { [key: string]: string } = {
      'EN_ATTENTE': 'badge-warning',
      'CONFIRMEE': 'badge-success',
      'ANNULEE': 'badge-danger',
    };
    return mapping[statut] || 'badge-default';
  }

  getStatutLabel(statut: string): string {
    const mapping: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'CONFIRMEE': 'Confirmée',
      'ANNULEE': 'Annulée',
    };
    return mapping[statut] || statut;
  }
}