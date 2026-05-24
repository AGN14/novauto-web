import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RendezVousService } from '../../../core/services/rendez-vous.service';
import { LucideAngularModule, Calendar, Clock, Eye, XCircle, CheckCircle, AlertTriangle, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-mes-rendez-vous',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './mes-rendez-vous.html',
  styleUrl: './mes-rendez-vous.css'
})
export class MesRendezVous implements OnInit {
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Eye = Eye;
  readonly XCircle = XCircle;
  readonly CheckCircle = CheckCircle;
  readonly AlertTriangle = AlertTriangle;
  readonly Trash2 = Trash2;

  rendezVous = signal<any[]>([]);
  isLoading = signal(true);
  cancelConfirm = signal<number | null>(null);
  isCancelling = signal(false);
  deleteConfirm = signal<number | null>(null);
  isDeleting = signal(false);
  actionMessage = signal<{ type: 'success' | 'error', text: string } | null>(null);

  constructor(private rendezVousService: RendezVousService) {}

  ngOnInit(): void {
    this.loadRendezVous();
  }

  loadRendezVous(): void {
    this.rendezVousService.getMesRendezVous().subscribe({
      next: (data) => {
        this.rendezVous.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  annulerRendezVous(id: number): void {
    this.isCancelling.set(true);
    this.rendezVousService.annuler(id).subscribe({
      next: () => {
        this.rendezVous.update(list =>
          list.map(r => r.id === id ? { ...r, statut: 'ANNULE' } : r)
        );
        this.cancelConfirm.set(null);
        this.isCancelling.set(false);
        this.actionMessage.set({ type: 'success', text: 'Rendez-vous annulé.' });
        setTimeout(() => this.actionMessage.set(null), 5000);
      },
      error: () => this.isCancelling.set(false)
    });
  }

  supprimerRendezVous(id: number): void {
    this.isDeleting.set(true);
    this.rendezVousService.annuler(id).subscribe({
      next: () => {
        this.rendezVous.update(list => list.filter(r => r.id !== id));
        this.deleteConfirm.set(null);
        this.isDeleting.set(false);
        this.actionMessage.set({ type: 'success', text: 'Rendez-vous supprimé de votre historique.' });
        setTimeout(() => this.actionMessage.set(null), 5000);
      },
      error: () => this.isDeleting.set(false)
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'badge-gold';
      case 'CONFIRME': return 'badge-success';
      case 'ANNULE': return 'badge-muted';
      case 'AUTRE_DATE_PROPOSEE': return 'badge-warning';
      default: return 'badge-muted';
    }
  }

  getStatutIcon(statut: string): any {
    switch (statut) {
      case 'EN_ATTENTE': return this.Clock;
      case 'CONFIRME': return this.CheckCircle;
      case 'ANNULE': return this.XCircle;
      case 'AUTRE_DATE_PROPOSEE': return this.AlertTriangle;
      default: return this.Clock;
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'CONFIRME': return 'Confirmé';
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
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatHeure(heureStr: string): string {
    return heureStr.substring(0, 5);
  }

  canCancel(rdv: any): boolean {
    return rdv.statut !== 'ANNULE';
  }

  canDelete(rdv: any): boolean {
    return rdv.statut === 'ANNULE';
  }
}
