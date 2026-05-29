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

export interface PendingCreneau {
  heure_debut: string;
  heure_fin: string;
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
  @Input() canEdit = true;
  @Input() selectionMode = false;
  @Input() selectedCreneauId: number | null = null;

  @Output() creneauxBatchCreated = new EventEmitter<PendingCreneau[]>();
  @Output() creneauDeleted = new EventEmitter<number>();
  @Output() creneauSelected = new EventEmitter<Disponibilite>();

  readonly Trash2 = Trash2;
  readonly Plus = Plus;
  readonly Clock = Clock;
  readonly StatutDisponibiliteEnum = StatutDisponibiliteEnum;

  pendingCreneaux: PendingCreneau[] = [];
  showBatchForm = false;

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
    return [...this.disponibilites].sort((a, b) =>
      a.heure_debut.localeCompare(b.heure_debut)
    );
  }

  toggleBatchForm(): void {
    this.showBatchForm = !this.showBatchForm;
    if (!this.showBatchForm) {
      this.pendingCreneaux = [];
    }
  }

  addEmptyLine(): void {
    this.pendingCreneaux.push({ heure_debut: '', heure_fin: '' });
  }

  removePendingLine(index: number): void {
    this.pendingCreneaux.splice(index, 1);
  }

  addSuggestedToBatch(suggested: SuggestedCreneau): void {
    this.pendingCreneaux.push({
      heure_debut: suggested.heure_debut,
      heure_fin: suggested.heure_fin
    });
    if (!this.showBatchForm) {
      this.showBatchForm = true;
    }
  }

  createAllCreneaux(): void {
    for (const creneau of this.pendingCreneaux) {
      if (!creneau.heure_debut || !creneau.heure_fin) {
        alert('Toutes les lignes doivent avoir une heure de début et une heure de fin');
        return;
      }
      if (creneau.heure_debut >= creneau.heure_fin) {
        alert('L\'heure de fin doit être après l\'heure de début');
        return;
      }
    }
    if (this.pendingCreneaux.length === 0) {
      alert('Ajoutez au moins un créneau');
      return;
    }
    this.creneauxBatchCreated.emit([...this.pendingCreneaux]);
    this.pendingCreneaux = [];
    this.showBatchForm = false;
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