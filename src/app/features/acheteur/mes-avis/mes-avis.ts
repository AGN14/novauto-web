import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvisService } from '../../../core/services/avis.service';
import { StarRating } from '../../../shared/components/star-rating/star-rating';
import { LucideAngularModule, Star, MessageCircle } from 'lucide-angular';

@Component({
  selector: 'app-mes-avis',
  standalone: true,
  imports: [CommonModule, StarRating, LucideAngularModule],
  templateUrl: './mes-avis.html',
  styleUrl: './mes-avis.css'
})
export class MesAvis implements OnInit {
  readonly Star = Star;
  readonly MessageCircle = MessageCircle;

  avis = signal<any[]>([]);
  isLoading = signal(true);

  constructor(private avisService: AvisService) {}

  ngOnInit(): void {
    this.avisService.getMesAvis().subscribe({
      next: (data) => {
        this.avis.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'badge-gold';
      case 'APPROUVE': return 'badge-success';
      case 'REJETE': return 'badge-error';
      default: return 'badge-muted';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'APPROUVE': return 'Approuvé';
      case 'REJETE': return 'Rejeté';
      default: return statut;
    }
  }
}
