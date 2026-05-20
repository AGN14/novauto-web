import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnnonceService } from '../../../core/services/annonce';
import { LucideAngularModule, Plus, Eye, Edit, Trash2, Car } from 'lucide-angular';

@Component({
  selector: 'app-mes-annonces',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule],
  templateUrl: './mes-annonces.html',
  styleUrl: './mes-annonces.css'
})
export class MesAnnonces implements OnInit {

  readonly Plus = Plus;
  readonly Eye = Eye;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Car = Car;

  annonces = signal<any[]>([]);
  isLoading = signal(true);
  deleteConfirm = signal<number | null>(null);
  isDeleting = signal(false);
  editAnnonce = signal<any>(null);
  isSaving = signal(false);

  editForm: any = {};

  constructor(private annonceService: AnnonceService) {}

  ngOnInit(): void {
    this.loadAnnonces();
  }

  loadAnnonces(): void {
    this.isLoading.set(true);
    this.annonceService.getMesAnnonces().subscribe({
      next: (data) => {
        this.annonces.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openEdit(annonce: any): void {
    this.editAnnonce.set(annonce);
    this.editForm = {
      titre: annonce.titre,
      prix: annonce.prix,
      statut: annonce.statut,
      statut_douanier: annonce.vehicule?.statut_douanier,
    };
  }

  cancelEdit(): void {
    this.editAnnonce.set(null);
    this.editForm = {};
  }

  saveEdit(): void {
    this.isSaving.set(true);
    this.annonceService.update(this.editAnnonce().id, this.editForm).subscribe({
      next: (updated) => {
        this.annonces.update(list =>
          list.map(a => a.id === updated.id ? { ...a, ...updated } : a)
        );
        this.cancelEdit();
        this.isSaving.set(false);
      },
      error: () => this.isSaving.set(false)
    });
  }

  confirmDelete(id: number): void {
    this.deleteConfirm.set(id);
  }

  cancelDelete(): void {
    this.deleteConfirm.set(null);
  }

  deleteAnnonce(id: number): void {
    this.isDeleting.set(true);
    this.annonceService.delete(id).subscribe({
      next: () => {
        this.annonces.update(list => list.filter(a => a.id !== id));
        this.deleteConfirm.set(null);
        this.isDeleting.set(false);
      },
      error: () => this.isDeleting.set(false)
    });
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'DISPONIBLE': return 'badge-success';
      case 'RESERVEE':   return 'badge-gold';
      case 'VENDUE':     return 'badge-muted';
      default:           return 'badge-muted';
    }
  }
}