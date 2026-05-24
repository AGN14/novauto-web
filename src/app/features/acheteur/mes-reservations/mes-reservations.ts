import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { LucideAngularModule, CreditCard, Eye, XCircle, CheckCircle, Clock, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-mes-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './mes-reservations.html',
  styleUrl: './mes-reservations.css'
})
export class MesReservations implements OnInit {
  readonly CreditCard = CreditCard;
  readonly Eye = Eye;
  readonly XCircle = XCircle;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly Trash2 = Trash2;

  reservations = signal<any[]>([]);
  isLoading = signal(true);
  cancelConfirm = signal<number | null>(null);
  isCancelling = signal(false);
  deleteConfirm = signal<number | null>(null);
  isDeleting = signal(false);
  actionMessage = signal<{ type: 'success' | 'error', text: string } | null>(null);

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getMesReservations().subscribe({
      next: (data) => {
        this.reservations.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  annulerReservation(id: number): void {
    this.isCancelling.set(true);
    this.reservationService.annuler(id).subscribe({
      next: () => {
        this.reservations.update(list =>
          list.map(r => r.id === id ? { ...r, statut: 'ANNULEE' } : r)
        );
        this.cancelConfirm.set(null);
        this.isCancelling.set(false);
        this.actionMessage.set({ type: 'success', text: 'Réservation annulée.' });
        setTimeout(() => this.actionMessage.set(null), 5000);
      },
      error: () => this.isCancelling.set(false)
    });
  }

  supprimerReservation(id: number): void {
    this.isDeleting.set(true);
    this.reservationService.annuler(id).subscribe({
      next: () => {
        this.reservations.update(list => list.filter(r => r.id !== id));
        this.deleteConfirm.set(null);
        this.isDeleting.set(false);
        this.actionMessage.set({ type: 'success', text: 'Réservation supprimée de votre historique.' });
        setTimeout(() => this.actionMessage.set(null), 5000);
      },
      error: () => this.isDeleting.set(false)
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'badge-gold';
      case 'CONFIRMEE': return 'badge-success';
      case 'ANNULEE': return 'badge-muted';
      default: return 'badge-muted';
    }
  }

  getStatutIcon(statut: string): any {
    switch (statut) {
      case 'EN_ATTENTE': return this.Clock;
      case 'CONFIRMEE': return this.CheckCircle;
      case 'ANNULEE': return this.XCircle;
      default: return this.Clock;
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'CONFIRMEE': return 'Confirmée';
      case 'ANNULEE': return 'Annulée';
      default: return statut;
    }
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  canCancel(reservation: any): boolean {
    return reservation.statut !== 'ANNULEE';
  }

  canDelete(reservation: any): boolean {
    return reservation.statut === 'ANNULEE';
  }
}
