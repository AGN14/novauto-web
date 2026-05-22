import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { LucideAngularModule, Eye, CheckCircle, Clock, XCircle } from 'lucide-angular';

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

  reservations = signal<any[]>([]);
  isLoading = signal(true);
  isConfirming = signal<number | null>(null);

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getVendeurReservations().subscribe({
      next: (data) => {
        this.reservations.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  confirmerReservation(id: number): void {
    this.isConfirming.set(id);
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

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'badge-gold';
      case 'CONFIRMEE':  return 'badge-success';
      case 'ANNULEE':    return 'badge-muted';
      default:           return 'badge-muted';
    }
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }
}
