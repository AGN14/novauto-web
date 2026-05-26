import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Users, Car, TrendingUp, ShieldCheck, Eye, CheckCircle, XCircle, Clock, ArrowRight, Package, UserPlus } from 'lucide-angular';

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
  readonly Clock = Clock;
  readonly ArrowRight = ArrowRight;
  readonly Package = Package;
  readonly UserPlus = UserPlus;

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
    console.log('=== Admin Dashboard - Loading Stats ===');
    console.log('URL:', `${this.API_URL}/admin/stats`);
    console.log('Token:', localStorage.getItem('novauto_token'));

    this.http.get<any>(`${this.API_URL}/admin/stats`).subscribe({
      next: (data) => {
        console.log('✅ Stats loaded:', data);
        this.stats.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Error loading stats:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.message);
        console.error('Error details:', err.error);
        this.isLoading.set(false);
      }
    });
  }

  loadDernieresAnnonces(): void {
    console.log('=== Admin Dashboard - Loading Annonces ===');
    this.http.get<any>(`${this.API_URL}/admin/annonces?per_page=5`).subscribe({
      next: (data) => {
        console.log('✅ Annonces loaded:', data);
        this.dernieresAnnonces.set(data.data || data);
      },
      error: (err) => console.error('❌ Error loading annonces:', err)
    });
  }

  loadDerniersVendeurs(): void {
    console.log('=== Admin Dashboard - Loading Vendeurs ===');
    this.http.get<any>(`${this.API_URL}/admin/vendeurs?per_page=5`).subscribe({
      next: (data) => {
        console.log('✅ Vendeurs loaded:', data);
        this.derniersVendeurs.set(data.data || data);
      },
      error: (err) => console.error('❌ Error loading vendeurs:', err)
    });
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'DISPONIBLE': return 'badge badge-success';
      case 'RESERVEE':   return 'badge badge-warning';
      case 'VENDUE':     return 'badge badge-default';
      default:           return 'badge badge-default';
    }
  }
}