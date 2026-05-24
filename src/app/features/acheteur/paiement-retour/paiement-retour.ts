import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaiementService } from '../../../core/services/paiement.service';
import { LucideAngularModule, CheckCircle, XCircle, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-paiement-retour',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './paiement-retour.html',
  styleUrl: './paiement-retour.css'
})
export class PaiementRetour implements OnInit {
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Loader2 = Loader2;

  isLoading = signal(true);
  statut = signal<'APPROUVE' | 'ECHOUE' | 'EN_ATTENTE'>('EN_ATTENTE');
  reservationId = signal<number | null>(null);
  message = signal('Vérification du paiement en cours...');
  verificationCount = 0;
  maxVerifications = 10; // 10 x 3s = 30 secondes max

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paiementService: PaiementService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const resId = params['reservation_id'];

      if (resId) {
        this.reservationId.set(+resId);
        this.verifierPaiement(+resId);
      } else {
        this.isLoading.set(false);
        this.statut.set('ECHOUE');
        this.message.set('Aucune réservation spécifiée.');
      }
    });
  }

  verifierPaiement(reservationId: number): void {
    this.verificationCount++;

    this.paiementService.verifierPaiement(reservationId).subscribe({
      next: (data) => {
        console.log('Statut paiement:', data, `(tentative ${this.verificationCount}/${this.maxVerifications})`);

        if (data.statut === 'APPROUVE') {
          this.statut.set('APPROUVE');
          this.message.set('Paiement confirmé ! Votre réservation est validée.');
          this.isLoading.set(false);
        } else if (data.statut === 'ECHOUE') {
          this.statut.set('ECHOUE');
          this.message.set('Le paiement a échoué. Veuillez réessayer.');
          this.isLoading.set(false);
        } else {
          // EN_ATTENTE
          if (this.verificationCount >= this.maxVerifications) {
            // Timeout après 30 secondes
            this.statut.set('ECHOUE');
            this.message.set('Délai de vérification dépassé. Vérifiez vos réservations ou contactez le support.');
            this.isLoading.set(false);
          } else {
            // Réessayer après 3 secondes
            this.statut.set('EN_ATTENTE');
            this.message.set(`Vérification en cours... (${this.verificationCount}/${this.maxVerifications})`);
            setTimeout(() => this.verifierPaiement(reservationId), 3000);
          }
        }
      },
      error: (err) => {
        console.error('Erreur vérification paiement:', err);
        this.isLoading.set(false);
        this.statut.set('ECHOUE');
        this.message.set('Erreur lors de la vérification du paiement.');
      }
    });
  }

  allerMesReservations(): void {
    this.router.navigate(['/acheteur/mes-reservations']);
  }

  retenterPaiement(): void {
    // Retour au catalogue pour choisir un autre véhicule
    this.router.navigate(['/catalogue']);
  }
}
