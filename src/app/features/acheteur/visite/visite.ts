import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnnonceService } from '../../../core/services/annonce';
import { ReservationService } from '../../../core/services/reservation.service';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule, ArrowLeft, Calendar, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-visite',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule],
  templateUrl: './visite.html',
  styleUrl: './visite.css'
})
export class Visite implements OnInit {

  readonly ArrowLeft = ArrowLeft;
  readonly Calendar = Calendar;
  readonly CheckCircle = CheckCircle;
  readonly AlertTriangle = AlertTriangle;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  annonce = signal<any>(null);
  isLoading = signal(true);
  isSubmitting = signal(false);
  success = signal(false);
  errorMessage = signal('');

  message = signal('');
  selectedDate = signal<string>('');
  currentMonth = signal(new Date());

  get joursCalendrier(): any[] {
    const date = this.currentMonth();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      d.setHours(0, 0, 0, 0);
      days.push({
        jour: i,
        date: d.toISOString().split('T')[0],
        passe: d <= today,
        weekend: d.getDay() === 0 || d.getDay() === 6
      });
    }

    return days;
  }

  get moisLabel(): string {
    return this.currentMonth().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annonceService: AnnonceService,
    private reservationService: ReservationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.annonceService.getById(+id).subscribe({
      next: (data) => {
        this.annonce.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  moisPrecedent(): void {
    const d = new Date(this.currentMonth());
    d.setMonth(d.getMonth() - 1);
    this.currentMonth.set(d);
  }

  moisSuivant(): void {
    const d = new Date(this.currentMonth());
    d.setMonth(d.getMonth() + 1);
    this.currentMonth.set(d);
  }

  selectDate(date: string): void {
    this.selectedDate.set(date);
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  onSubmit(): void {
    if (!this.selectedDate()) {
      this.errorMessage.set('Veuillez sélectionner une date de visite.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.reservationService.create({
      annonce_id: this.annonce().id,
      montant: 0,
      message: this.message(),
      type_reservation: 'VISITE',
      date_visite: this.selectedDate(),
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.success.set(true);
        // Rediriger vers mes réservations après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/acheteur/reservations']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Une erreur est survenue.');
      }
    });
  }
}
