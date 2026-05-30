import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisponibiliteService } from '../../../core/services/disponibilite.service';
import { Disponibilite } from '../../../core/models/rendez-vous.model';
import { CalendarDisponibilites } from '../../../shared/components/calendar-disponibilites/calendar-disponibilites';
import { CreneauxHoraires } from '../../../shared/components/creneaux-horaires/creneaux-horaires';
import { LucideAngularModule, Calendar, Clock, Plus, ArrowLeft } from 'lucide-angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-garage-disponibilites',
  standalone: true,
  imports: [CommonModule, CalendarDisponibilites, CreneauxHoraires, LucideAngularModule, RouterLink],
  templateUrl: './disponibilites.html',
  styleUrl: './disponibilites.css'
})
export class GarageDisponibilites implements OnInit {
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Plus = Plus;
  readonly ArrowLeft = ArrowLeft;

  disponibilites: Disponibilite[] = [];
  selectedDate: Date | null = null;
  selectedDateDisponibilites: Disponibilite[] = [];
  isLoading = signal(true);
  isSaving = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor(private disponibiliteService: DisponibiliteService) {}

  ngOnInit(): void {
    this.loadDisponibilites();
  }

  loadDisponibilites(): void {
    this.isLoading.set(true);
    this.disponibiliteService.getGarageDisponibilites().subscribe({
      next: (data) => {
        this.disponibilites = data;
        this.isLoading.set(false);
        if (this.selectedDate) {
          this.updateSelectedDateDisponibilites();
        }
      },
      error: (err) => {
        console.error('Erreur chargement disponibilités:', err);
        this.isLoading.set(false);
      }
    });
  }

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.updateSelectedDateDisponibilites();
  }

  private updateSelectedDateDisponibilites(): void {
    if (!this.selectedDate) {
      this.selectedDateDisponibilites = [];
      return;
    }
    const dateString = this.formatDate(this.selectedDate);
    this.selectedDateDisponibilites = this.disponibilites.filter(d => d.jour === dateString);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onCreneauxBatchCreated(creneaux: Array<{ heure_debut: string; heure_fin: string }>): void {
    if (!this.selectedDate) {
      this.errorMessage.set('Veuillez sélectionner une date');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const jour = this.formatDate(this.selectedDate);

    this.disponibiliteService.creerDisponibilitesBatchGarage(jour, creneaux).subscribe({
      next: (response) => {
        if (response.created && response.created.length > 0) {
          this.disponibilites.push(...response.created);
          this.updateSelectedDateDisponibilites();

          const successCount = response.success_count || response.created.length;
          const errorCount = response.error_count || 0;

          if (errorCount > 0) {
            this.successMessage.set(`${successCount} créneau(x) ajouté(s), ${errorCount} échec(s)`);
          } else {
            this.successMessage.set(`${successCount} créneau(x) ajouté(s) avec succès`);
          }
        }
        this.isSaving.set(false);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Erreur lors de l\'ajout des créneaux');
        this.isSaving.set(false);
      }
    });
  }

  onCreneauDeleted(id: number): void {
    this.disponibiliteService.supprimerDisponibiliteGarage(id).subscribe({
      next: () => {
        this.disponibilites = this.disponibilites.filter(d => d.id !== id);
        this.updateSelectedDateDisponibilites();
        this.successMessage.set('Créneau supprimé avec succès');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Erreur lors de la suppression');
      }
    });
  }
}