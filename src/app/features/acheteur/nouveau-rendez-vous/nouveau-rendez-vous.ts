import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RendezVousService } from '../../../core/services/rendez-vous.service';
import { DisponibiliteService } from '../../../core/services/disponibilite.service';
import { AnnonceService } from '../../../core/services/annonce';
import { LucideAngularModule, Calendar, Clock, MessageSquare, ArrowLeft, Send } from 'lucide-angular';
import { Disponibilite } from '../../../core/models/rendez-vous.model';
import { CalendarDisponibilites } from '../../../shared/components/calendar-disponibilites/calendar-disponibilites';
import { CreneauxHoraires } from '../../../shared/components/creneaux-horaires/creneaux-horaires';

@Component({
  selector: 'app-nouveau-rendez-vous',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LucideAngularModule,
    CalendarDisponibilites,
    CreneauxHoraires
  ],
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

  // Disponibilités
  disponibilites: Disponibilite[] = [];
  selectedDate: Date | null = null;
  selectedDateDisponibilites: Disponibilite[] = [];
  selectedDisponibilite: Disponibilite | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rendezVousService: RendezVousService,
    private disponibiliteService: DisponibiliteService,
    private annonceService: AnnonceService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.annonceId.set(+id);
      this.loadAnnonce();
      this.loadDisponibilites();
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

  loadDisponibilites(): void {
    this.disponibiliteService.getDisponibilitesAnnonce(this.annonceId()).subscribe({
      next: (data) => {
        this.disponibilites = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des disponibilités:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.selectedDisponibilite) {
      this.errorMessage.set('Veuillez sélectionner un créneau disponible.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formData = {
      annonce_id: this.annonceId(),
      date_rdv: this.selectedDisponibilite.jour,
      heure_rdv: this.selectedDisponibilite.heure_debut,
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

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.updateSelectedDateDisponibilites();
    this.selectedDisponibilite = null; // Reset créneau selection
  }

  private updateSelectedDateDisponibilites(): void {
    if (!this.selectedDate) {
      this.selectedDateDisponibilites = [];
      return;
    }

    const dateString = this.formatDate(this.selectedDate);
    this.selectedDateDisponibilites = this.disponibilites.filter(d => d.jour === dateString);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onCreneauSelected(disponibilite: Disponibilite): void {
    this.selectedDisponibilite = disponibilite;
    this.errorMessage.set(null);
  }
}
