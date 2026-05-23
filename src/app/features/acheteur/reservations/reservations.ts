import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { LucideAngularModule, Car, Eye, XCircle, CheckCircle, Clock, Trash2, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css'
})
export class Reservations implements OnInit {

  readonly Car = Car;
  readonly Eye = Eye;
  readonly XCircle = XCircle;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly Trash2 = Trash2;
  readonly ArrowRight = ArrowRight;

  reservations = signal<any[]>([]);
  isLoading = signal(true);
  cancelConfirm = signal<number | null>(null);
  isCancelling = signal(false);
  actionMessage = signal<{ type: 'success' | 'error', text: string } | null>(null);
  deleteConfirm = signal<number | null>(null);
  isDeleting = signal(false);
  clearHistoryConfirm = signal(false);
  isClearingHistory = signal(false);
  isConverting = signal<number | null>(null);

  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {}

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
      },
      error: () => this.isCancelling.set(false)
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'badge-gold';
      case 'CONFIRMEE':  return 'badge-success';
      case 'ANNULEE':    return 'badge-muted';
      default:           return 'badge-muted';
    }
  }

  getStatutIcon(statut: string): any {
    switch (statut) {
      case 'EN_ATTENTE': return this.Clock;
      case 'CONFIRMEE':  return this.CheckCircle;
      case 'ANNULEE':    return this.XCircle;
      default:           return this.Clock;
    }
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  canCancel(reservation: any): boolean {
    // Peut annuler si :
    // - Visite (montant_acompte = 0) peu importe le statut
    // - Acompte EN_ATTENTE seulement
    if (reservation.statut === 'ANNULEE') return false;

    if (reservation.montant_acompte === 0) {
      // Les visites peuvent toujours être annulées
      return true;
    } else {
      // Les acomptes ne peuvent être annulés que si EN_ATTENTE
      return reservation.statut === 'EN_ATTENTE';
    }
  }

  canConvert(reservation: any): boolean {
    return reservation.statut !== 'ANNULEE' && reservation.statut !== 'CONFIRMEE';
  }

  isVisite(reservation: any): boolean {
    return reservation.montant_acompte === 0;
  }

  isAcompte(reservation: any): boolean {
    return reservation.montant_acompte > 0;
  }

  convertirEnAcompte(reservation: any): void {
    // Rediriger vers la page de réservation avec acompte
    this.router.navigate(['/acheteur/reservation', reservation.annonce_id]);
  }

  convertirEnVisite(id: number): void {
    this.isConverting.set(id);
    this.actionMessage.set(null);

    this.reservationService.convertirEnVisite(id).subscribe({
      next: () => {
        this.isConverting.set(null);
        this.actionMessage.set({ type: 'success', text: 'Réservation convertie en visite gratuite.' });
        this.loadReservations();
        setTimeout(() => this.actionMessage.set(null), 5000);
      },
      error: (err) => {
        this.isConverting.set(null);
        this.actionMessage.set({ type: 'error', text: err.error?.message || 'Erreur lors de la conversion.' });
      }
    });
  }

  getTypeLabel(reservation: any): string {
    if (reservation.montant_acompte === 0) {
      return 'Visite gratuite';
    } else {
      return `Acompte - ${this.formatPrix(reservation.montant_acompte)} FCFA`;
    }
  }

  supprimerReservation(id: number): void {
    this.isDeleting.set(true);
    this.reservationService.annuler(id).subscribe({
      next: () => {
        // Retirer complètement de la liste
        this.reservations.update(list => list.filter(r => r.id !== id));
        this.deleteConfirm.set(null);
        this.isDeleting.set(false);
        this.actionMessage.set({ type: 'success', text: 'Réservation supprimée de votre historique.' });
        setTimeout(() => this.actionMessage.set(null), 5000);
      },
      error: () => this.isDeleting.set(false)
    });
  }

  hasReservationsAnnulees(): boolean {
    return this.reservations().some(r => r.statut === 'ANNULEE');
  }

  viderHistorique(): void {
    const reservationsAnnulees = this.reservations().filter(r => r.statut === 'ANNULEE');
    if (reservationsAnnulees.length === 0) return;

    this.isClearingHistory.set(true);

    // Supprimer toutes les réservations annulées une par une
    let completed = 0;
    reservationsAnnulees.forEach(reservation => {
      this.reservationService.annuler(reservation.id).subscribe({
        next: () => {
          completed++;
          if (completed === reservationsAnnulees.length) {
            // Toutes les suppressions sont terminées
            this.reservations.update(list => list.filter(r => r.statut !== 'ANNULEE'));
            this.clearHistoryConfirm.set(false);
            this.isClearingHistory.set(false);
            this.actionMessage.set({
              type: 'success',
              text: `${reservationsAnnulees.length} réservation(s) supprimée(s) de votre historique.`
            });
            setTimeout(() => this.actionMessage.set(null), 5000);
          }
        },
        error: () => {
          completed++;
          if (completed === reservationsAnnulees.length) {
            this.clearHistoryConfirm.set(false);
            this.isClearingHistory.set(false);
          }
        }
      });
    });
  }
}
