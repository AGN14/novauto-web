import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, Trash2, Search } from 'lucide-angular';

@Component({
  selector: 'app-annonces',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule],
  templateUrl: './annonces.html',
  styleUrl: './annonces.css'
})
export class Annonces implements OnInit {

  readonly Eye = Eye;
  readonly Trash2 = Trash2;
  readonly Search = Search;

  annonces = signal<any[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  currentPage = signal(1);
  lastPage = signal(1);
  total = signal(0);
  deleteConfirm = signal<number | null>(null);
  isDeleting = signal(false);

  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAnnonces();
  }

  loadAnnonces(page: number = 1): void {
    this.isLoading.set(true);
    this.http.get<any>(`${this.API_URL}/admin/annonces?page=${page}&per_page=10`).subscribe({
      next: (data) => {
        this.annonces.set(data.data || data);
        this.currentPage.set(data.current_page || 1);
        this.lastPage.set(data.last_page || 1);
        this.total.set(data.total || data.length);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  filteredAnnonces() {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.annonces();
    return this.annonces().filter(a =>
      a.titre?.toLowerCase().includes(q) ||
      a.vendeur?.user?.nom?.toLowerCase().includes(q)
    );
  }

  deleteAnnonce(id: number): void {
    this.isDeleting.set(true);
    this.http.delete(`${this.API_URL}/admin/annonces/${id}`).subscribe({
      next: () => {
        this.annonces.update(list => list.filter(a => a.id !== id));
        this.deleteConfirm.set(null);
        this.isDeleting.set(false);
      },
      error: () => this.isDeleting.set(false)
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'DISPONIBLE': return 'badge-success';
      case 'RESERVEE':   return 'badge-gold';
      case 'VENDUE':     return 'badge-muted';
      default:           return 'badge-muted';
    }
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.lastPage()) {
      this.loadAnnonces(page);
    }
  }
}