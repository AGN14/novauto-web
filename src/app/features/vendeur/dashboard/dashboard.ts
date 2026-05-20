import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnnonceService } from '../../../core/services/annonce';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule, Car, Plus, TrendingUp, Eye, Edit, Trash2, Smile } from 'lucide-angular';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  readonly Car = Car;
  readonly Plus = Plus;
  readonly TrendingUp = TrendingUp;
  readonly Eye = Eye;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Smile = Smile;

  annonces = signal<any[]>([]);
  isLoading = signal(true);

  constructor(
    private annonceService: AnnonceService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAnnonces();
  }

  loadAnnonces(): void {
    this.annonceService.getMesAnnonces().subscribe({
      next: (data) => {
        this.annonces.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  get totalAnnonces() { return this.annonces().length; }
  get annoncesDisponibles() { return this.annonces().filter(a => a.statut === 'DISPONIBLE').length; }
  get annoncesReservees() { return this.annonces().filter(a => a.statut === 'RESERVEE').length; }
  get annoncesVendues() { return this.annonces().filter(a => a.statut === 'VENDUE').length; }

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