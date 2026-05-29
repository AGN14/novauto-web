import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Calendar, Clock, LucideAngularModule } from 'lucide-angular';
import { DisponibiliteService } from '../../../core/services/disponibilite.service';
import { Disponibilite } from '../../../core/models/rendez-vous.model';
import { CalendarDisponibilites } from '../../../shared/components/calendar-disponibilites/calendar-disponibilites';
import { CreneauxHoraires } from '../../../shared/components/creneaux-horaires/creneaux-horaires';

@Component({
  selector: 'app-disponibilites',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    CalendarDisponibilites,
    CreneauxHoraires
  ],
  templateUrl: './disponibilites.html',
  styleUrl: './disponibilites.css',
})
export class Disponibilites implements OnInit {
  readonly Calendar = Calendar;
  readonly Clock = Clock;

  disponibilites: Disponibilite[] = [];
  selectedDate: Date | null = null;
  selectedDateDisponibilites: Disponibilite[] = [];
  loading = false;
  error = '';

  constructor(private disponibiliteService: DisponibiliteService) {}

  ngOnInit(): void {
    this.loadDisponibilites();
  }

  loadDisponibilites(): void {
    this.loading = true;
    this.error = '';

    this.disponibiliteService.getVendeurDisponibilites().subscribe({
      next: (data) => {
        this.disponibilites = data;
        this.loading = false;
        if (this.selectedDate) {
          this.updateSelectedDateDisponibilites();
        }
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des disponibilités';
        console.error('Erreur:', err);
        this.loading = false;
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

  onCreneauCreated(creneau: { heure_debut: string; heure_fin: string }): void {
    if (!this.selectedDate) return;

    const data = {
      jour: this.formatDate(this.selectedDate),
      heure_debut: creneau.heure_debut,
      heure_fin: creneau.heure_fin
    };

    this.loading = true;
    this.disponibiliteService.creerDisponibilite(data).subscribe({
      next: () => {
        this.loadDisponibilites();
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la création du créneau';
        console.error('Erreur:', err);
        this.loading = false;
      }
    });
  }

  onCreneauDeleted(id: number): void {
    this.loading = true;
    this.disponibiliteService.supprimerDisponibilite(id).subscribe({
      next: () => {
        this.loadDisponibilites();
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la suppression du créneau';
        console.error('Erreur:', err);
        this.loading = false;
      }
    });
  }
}
