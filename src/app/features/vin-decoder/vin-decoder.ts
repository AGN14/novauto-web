import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VinService } from '../../core/services/vin';
import { AuthService } from '../../core/services/auth.service';
import { LucideAngularModule, Search, AlertTriangle, CheckCircle, Car, Info, Lock } from 'lucide-angular';

@Component({
  selector: 'app-vin-decoder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './vin-decoder.html',
  styleUrl: './vin-decoder.css'
})
export class VinDecoder {
  readonly Search = Search;
  readonly AlertTriangle = AlertTriangle;
  readonly CheckCircle = CheckCircle;
  readonly Car = Car;
  readonly Info = Info;
  readonly Lock = Lock;

  vin = signal('');
  isLoading = signal(false);
  errorMessage = signal('');
  result = signal<any>(null);

  constructor(
    private vinService: VinService,
    public authService: AuthService
  ) {}

  onSubmit(): void {
    const vinValue = this.vin().trim().toUpperCase();
    if (vinValue.length !== 17) {
      this.errorMessage.set('Le numéro VIN doit contenir exactement 17 caractères.');
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.result.set(null);
    this.vinService.decodeVin(vinValue).subscribe({
      next: (data) => {
        if (!data.marque && !data.modele) {
          this.errorMessage.set('VIN invalide ou non reconnu. Vérifiez le numéro saisi.');
        } else {
          this.result.set(data);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur de connexion à l\'API. Réessayez plus tard.');
        this.isLoading.set(false);
      }
    });
  }

  reset(): void {
    this.vin.set('');
    this.result.set(null);
    this.errorMessage.set('');
  }

  onVinInput(event: any): void {
    this.vin.set(event.target.value.toUpperCase());
  }
}