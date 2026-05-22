import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, ArrowLeft, Trash2, Calendar, Gauge, Shield, CheckCircle, MapPin } from 'lucide-angular';

@Component({
  selector: 'app-admin-annonce-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './annonce-detail.html',
  styleUrl: './annonce-detail.css'
})
export class AdminAnnonceDetail implements OnInit {

  readonly ArrowLeft = ArrowLeft;
  readonly Trash2 = Trash2;
  readonly Calendar = Calendar;
  readonly Gauge = Gauge;
  readonly Shield = Shield;
  readonly CheckCircle = CheckCircle;
  readonly MapPin = MapPin;

  annonce = signal<any>(null);
  isLoading = signal(true);
  photoActive = signal(0);
  deleteConfirm = signal(false);
  isDeleting = signal(false);

  private readonly API_URL = 'http://localhost:8000/api';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.http.get<any>(`${this.API_URL}/catalogue/${id}`).subscribe({
      next: (data) => {
        this.annonce.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  getStatutDouanier(): string {
    return this.annonce()?.vehicule?.statut_douanier === 'DEDOUANE' ? 'DÉDOUANÉ' : 'EN TRANSIT';
  }

  getStatutClass(): string {
    switch (this.annonce()?.statut) {
      case 'DISPONIBLE': return 'badge-success';
      case 'RESERVEE':   return 'badge-gold';
      case 'VENDUE':     return 'badge-muted';
      default:           return 'badge-muted';
    }
  }

  setPhotoActive(index: number): void {
    this.photoActive.set(index);
  }

  deleteAnnonce(): void {
    this.isDeleting.set(true);
    this.http.delete(`${this.API_URL}/admin/annonces/${this.annonce().id}`).subscribe({
      next: () => this.router.navigate(['/admin/annonces']),
      error: () => this.isDeleting.set(false)
    });
  }
}