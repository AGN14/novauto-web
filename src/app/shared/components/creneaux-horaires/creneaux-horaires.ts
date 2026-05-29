import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trash2, Plus, Clock, LucideAngularModule } from 'lucide-angular';
import { Disponibilite, StatutDisponibiliteEnum } from '../../../core/models/rendez-vous.model';

export interface SuggestedCreneau {
  heure_debut: string;
  heure_fin: string;
  label: string;
}

@Component({
  selector: 'app-creneaux-horaires',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './creneaux-horaires.html',
  styleUrl: './creneaux-horaires.css'
})
export class CreneauxHoraires {
  @Input() disponibilites: Disponibilite[] = [];
  @Input() selectedDate: Date | null = null;
  @Input() canEdit = true; // Si false, mode lecture seule (pour acheteur)
  @Input() selectionMode = false; // Si true, permet la sélection d'un créneau
  @Input() selectedCreneauId: number | null = null;

  @Output() creneauCreated = new EventEmitter<{ heure_debut: string; heure_fin: string }>();
  @Output() creneauDeleted = new EventEmitter<number>();
  @Output() creneauSelected = new EventEmitter<Disponibilite>();

  readonly Trash2 = Trash2;
  readonly Plus = Plus;
  readonly Clock = Clock;
  readonly StatutDisponibiliteEnum = StatutDisponibiliteEnum;

  heureDebut = '';
  heureFin = '';
  showForm = false;

  readonly suggestedCreneaux: SuggestedCreneau[] = [
    { heure_debut: '09:00', heure_fin: '10:00', label: '09:00 - 10:00' },
    { heure_debut: '10:00', heure_fin: '11:00', label: '10:00 - 11:00' },
    { heure_debut: '11:00', heure_fin: '12:00', label: '11:00 - 12:00' },
    { heure_debut: '14:00', heure_fin: '15:00', label: '14:00 - 15:00' },
    { heure_debut: '15:00', heure_fin: '16:00', label: '15:00 - 16:00' },
    { heure_debut: '16:00', heure_fin: '17:00', label: '16:00 - 17:00' },
    { heure_debut: '17:00', heure_fin: '18:00', label: '17:00 - 18:00' }
  ];

  get formattedDate(): string {
    if (!this.selectedDate) return '';
    return this.selectedDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  get sortedDisponibilites(): Disponibilite[] {
    return [...this.disponibilites].sort((a, b) => {
      return a.heure_debut.localeCompare(b.heure_debut);
    });
  }

  get availableCreneaux(): Disponibilite[] {
    return this.sortedDisponibilites.filter(d => d.statut === StatutDisponibiliteEnum.LIBRE);
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.heureDebut = '';
      this.heureFin = '';
    }
  }

  useSuggestedCreneau(suggested: SuggestedCreneau): void {
    this.heureDebut = suggested.heure_debut;
    this.heureFin = suggested.heure_fin;
    this.showForm = true;
  }

  createCreneau(): void {
    if (!this.heureDebut || !this.heureFin) return;

    if (this.heureDebut >= this.heureFin) {
      alert('L\'heure de fin doit être après l\'heure de début');
      return;
    }

    this.creneauCreated.emit({
      heure_debut: this.heureDebut,
      heure_fin: this.heureFin
    });

    this.heureDebut = '';
    this.heureFin = '';
    this.showForm = false;
  }

  deleteCreneau(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) {
      this.creneauDeleted.emit(id);
    }
  }

  selectCreneau(disponibilite: Disponibilite): void {
    if (this.selectionMode && disponibilite.statut === StatutDisponibiliteEnum.LIBRE) {
      this.creneauSelected.emit(disponibilite);
    }
  }

  isCreneauSelected(disponibilite: Disponibilite): boolean {
    return this.selectedCreneauId === disponibilite.id;
  }

  getStatutClass(statut: StatutDisponibiliteEnum): string {
    return statut === StatutDisponibiliteEnum.LIBRE ? 'libre' : 'occupe';
  }

  getStatutLabel(statut: StatutDisponibiliteEnum): string {
    return statut === StatutDisponibiliteEnum.LIBRE ? 'Disponible' : 'Occupé';
  }
}
