import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Users, Car, TrendingUp, ShieldCheck, Eye, CheckCircle, XCircle } from 'lucide-angular';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  readonly Users = Users;
  readonly Car = Car;
  readonly TrendingUp = TrendingUp;
  readonly ShieldCheck = ShieldCheck;
  readonly Eye = Eye;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;

  stats = signal<any>({
    totalVendeurs: 0,
    totalAcheteurs: 0,
    totalAnnonces: 0,
    annoncesDisponibles: 0,
    annoncesReservees: 0,
    annoncesVendues: 0,
  });

  dernieresAnnonces = signal<any[]>([]);
  derniersVendeurs = signal<any[]>([]);
  isLoading = signal(true);

  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadDernieresAnnonces();
    this.loadDerniersVendeurs();
  }

  loadStats(): void {
    this.http.get<any>(`${this.API_URL}/admin/stats`).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadDernieresAnnonces(): void {
    this.http.get<any>(`${this.API_URL}/admin/annonces?per_page=5`).subscribe({
      next: (data) => this.dernieresAnnonces.set(data.data || data)
    });
  }

  loadDerniersVendeurs(): void {
    this.http.get<any>(`${this.API_URL}/admin/vendeurs?per_page=5`).subscribe({
      next: (data) => this.derniersVendeurs.set(data.data || data)
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