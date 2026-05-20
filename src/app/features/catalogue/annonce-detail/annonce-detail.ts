import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnnonceService } from '../../../core/services/annonce';
import { LucideAngularModule, ArrowLeft, MapPin, Calendar, Gauge, Shield, CheckCircle, Phone, Copy } from 'lucide-angular';

@Component({
  selector: 'app-annonce-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './annonce-detail.html',
  styleUrl: './annonce-detail.css'
})
export class AnnonceDetail implements OnInit {

  readonly ArrowLeft = ArrowLeft;
  readonly MapPin = MapPin;
  readonly Calendar = Calendar;
  readonly Gauge = Gauge;
  readonly Shield = Shield;
  readonly CheckCircle = CheckCircle;
  readonly Phone = Phone;
  readonly Copy = Copy;

  annonce = signal<any>(null);
  isLoading = signal(true);
  photoActive = signal(0);
  vinCopied = signal(false);

  constructor(
    private route: ActivatedRoute,
    private annonceService: AnnonceService
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

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  getStatutDouanier(): string {
    return this.annonce()?.vehicule?.statut_douanier === 'DEDOUANE' ? 'DÉDOUANÉ' : 'EN TRANSIT';
  }

  setPhotoActive(index: number): void {
    this.photoActive.set(index);
  }

  copyVin(): void {
    const vin = this.annonce()?.vehicule?.vin;
    if (vin) {
      navigator.clipboard.writeText(vin);
      this.vinCopied.set(true);
      setTimeout(() => this.vinCopied.set(false), 2000);
    }
  }
}