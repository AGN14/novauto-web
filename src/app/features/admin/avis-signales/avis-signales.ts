import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvisService } from '../../../core/services/avis.service';
import { StarRating } from '../../../shared/components/star-rating/star-rating';

@Component({
  selector: 'app-avis-signales',
  standalone: true,
  imports: [CommonModule, StarRating],
  templateUrl: './avis-signales.html',
  styleUrls: ['./avis-signales.css']
})
export class AvisSignalesComponent implements OnInit {
  avisSignales = signal<any[]>([]);
  isLoading = signal(true);
  message = signal<{ type: 'success' | 'error', text: string } | null>(null);

  constructor(private avisService: AvisService) {}

  ngOnInit(): void {
    this.chargerAvisSignales();
  }

  chargerAvisSignales(): void {
    this.isLoading.set(true);
    this.avisService.getAvisSignales().subscribe({
      next: (data) => {
        this.avisSignales.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des avis signalés:', err);
        this.isLoading.set(false);
        this.showMessage('error', 'Erreur lors du chargement des avis signalés');
      }
    });
  }

  supprimerAvis(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis définitivement ?')) {
      return;
    }

    this.avisService.supprimerAvis(id).subscribe({
      next: () => {
        this.showMessage('success', 'Avis supprimé avec succès');
        this.chargerAvisSignales();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        this.showMessage('error', 'Erreur lors de la suppression de l\'avis');
      }
    });
  }

  rejeterSignalement(id: number): void {
    if (!confirm('Rejeter le signalement ? L\'avis restera publié.')) {
      return;
    }

    this.avisService.rejeterSignalement(id).subscribe({
      next: () => {
        this.showMessage('success', 'Signalement rejeté. L\'avis reste publié.');
        this.chargerAvisSignales();
      },
      error: (err) => {
        console.error('Erreur lors du rejet:', err);
        this.showMessage('error', 'Erreur lors du rejet du signalement');
      }
    });
  }

  showMessage(type: 'success' | 'error', text: string): void {
    this.message.set({ type, text });
    setTimeout(() => this.message.set(null), 5000);
  }

  getVehiculeLabel(avis: any): string {
    const v = avis.annonce?.vehicule;
    if (!v) return 'Véhicule inconnu';
    return `${v.modele?.marque?.nom || ''} ${v.modele?.nom || ''} ${v.annee || ''}`.trim();
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
