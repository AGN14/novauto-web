import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RendezVousService } from '../../../core/services/rendez-vous.service';
import { AnnonceService } from '../../../core/services/annonce';
import { LucideAngularModule, Calendar, Clock, MessageSquare, ArrowLeft, Send } from 'lucide-angular';

@Component({
  selector: 'app-nouveau-rendez-vous',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './nouveau-rendez-vous.html',
  styleUrl: './nouveau-rendez-vous.css'
})
export class NouveauRendezVous implements OnInit {
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly MessageSquare = MessageSquare;
  readonly ArrowLeft = ArrowLeft;
  readonly Send = Send;

  form!: FormGroup;
  annonceId = signal<number>(0);
  annonce = signal<any>(null);
  isLoading = signal(true);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  // Calendrier
  currentMonth = signal<Date>(new Date());
  selectedDate = signal<Date | null>(null);

  // Horaire
  selectedHeure = signal<string | null>(null);
  creneaux = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rendezVousService: RendezVousService,
    private annonceService: AnnonceService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.annonceId.set(+id);
      this.loadAnnonce();
    }

    this.form = this.fb.group({
      message: ['', [Validators.maxLength(500)]]
    });
  }

  loadAnnonce(): void {
    this.annonceService.getById(this.annonceId()).subscribe({
      next: (data: any) => {
        this.annonce.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de charger l\'annonce.');
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.selectedDate() || !this.selectedHeure()) {
      this.errorMessage.set('Veuillez sélectionner une date et une heure.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const dateStr = this.formatDateForApi(this.selectedDate()!);

    const formData = {
      annonce_id: this.annonceId(),
      date_rdv: dateStr,
      heure_rdv: this.selectedHeure()!,
      message: this.form.value.message
    };

    this.rendezVousService.creerRendezVous(formData).subscribe({
      next: () => {
        this.router.navigate(['/acheteur/mes-rendez-vous']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Une erreur est survenue.');
      }
    });
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  // Calendrier
  getDaysInMonth(): Date[] {
    const year = this.currentMonth().getFullYear();
    const month = this.currentMonth().getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) {
      days.push(new Date(0));
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  }

  previousMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  selectDate(date: Date): void {
    if (date.getTime() === 0 || this.isPastDate(date)) return;
    this.selectedDate.set(date);
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  isSelectedDate(date: Date): boolean {
    if (!this.selectedDate() || date.getTime() === 0) return false;
    return date.toDateString() === this.selectedDate()!.toDateString();
  }

  getMonthName(): string {
    return this.currentMonth().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  selectHeure(heure: string): void {
    this.selectedHeure.set(heure);
  }

  formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
