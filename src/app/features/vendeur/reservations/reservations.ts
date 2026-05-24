import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { RendezVousService } from '../../../core/services/rendez-vous.service';
import { LucideAngularModule, Eye, CheckCircle, Clock, XCircle, Calendar, CreditCard } from 'lucide-angular';

@Component({
  selector: 'app-vendeur-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css'
})
export class VendeurReservations implements OnInit {

  readonly Eye = Eye;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly XCircle = XCircle;
  readonly Calendar = Calendar;
  readonly CreditCard = CreditCard;

  reservations = signal<any[]>([]);
  rendezVous = signal<any[]>([]);
  isLoading = signal(true);
  isConfirming = signal<{ type: 'reservation' | 'rendez-vous', id: number } | null>(null);
  activeTab = signal<'reservations' | 'rendez-vous'>('reservations');

  constructor(
    private reservationService: ReservationService,
    private rendezVousService: RendezVousService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    let reservationsLoaded = false;
    let rendezVousLoaded = false;

    const checkComplete = () => {
      if (reservationsLoaded && rendezVousLoaded) {
        this.isLoading.set(false);
      }
    };

    this.reservationService.getVendeurReservations().subscribe({
      next: (data) => {
        this.reservations.set(data);
        reservationsLoaded = true;
        checkComplete();
      },
      error: () => {
        reservationsLoaded = true;
        checkComplete();
      }
    });

    this.rendezVousService.getRendezVousVendeur().subscribe({
      next: (data) => {
        this.rendezVous.set(data);
        rendezVousLoaded = true;
        checkComplete();
      },
      error: () => {
        rendezVousLoaded = true;
        checkComplete();
      }
    });
  }

  confirmerReservation(id: number): void {
    this.isConfirming.set({ type: 'reservation', id });
    this.reservationService.confirmer(id).subscribe({
      next: () => {
        this.reservations.update(list =>
          list.map(r => r.id === id ? { ...r, statut: 'CONFIRMEE' } : r)
        );
        this.isConfirming.set(null);
      },
      error: () => this.isConfirming.set(null)
    });
  }

  confirmerRendezVous(id: number): void {
    this.isConfirming.set({ type: 'rendez-vous', id });
    this.rendezVousService.confirmer(id).subscribe({
      next: () => {
        this.rendezVous.update(list =>
          list.map(r => r.id === id ? { ...r, statut: 'CONFIRME' } : r)
        );
        this.isConfirming.set(null);
      },
      error: () => this.isConfirming.set(null)
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'badge-gold';
      case 'CONFIRMEE':
      case 'CONFIRME': return 'badge-success';
      case 'ANNULEE':
      case 'ANNULE': return 'badge-muted';
      case 'AUTRE_DATE_PROPOSEE': return 'badge-warning';
      default: return 'badge-muted';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'CONFIRMEE':
      case 'CONFIRME': return 'Confirmé';
      case 'ANNULEE':
      case 'ANNULE': return 'Annulé';
      case 'AUTRE_DATE_PROPOSEE': return 'Autre date proposée';
      default: return statut;
    }
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  formatHeure(heureStr: string): string {
    return heureStr.substring(0, 5);
  }

  isConfirmingItem(type: 'reservation' | 'rendez-vous', id: number): boolean {
    return this.isConfirming()?.type === type && this.isConfirming()?.id === id;
  }
}
