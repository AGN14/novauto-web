import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnonceService } from '../../core/services/annonce';
import { MarqueService } from '../../core/services/marque';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  annonces = signal<any[]>([]);
  marques = signal<any[]>([]);
  isLoading = signal(true);

  selectedMarque = signal<number | null>(null);
  selectedBudget = signal<number | null>(null);
  selectedStatut = signal<string>('');

  fonctionnalites = [
    {
      icone: '◈',
      titre: 'Vendeurs Certifiés',
      description: 'Chaque vendeur fait l\'objet d\'un contrôle rigoureux de son IFU et de son identité pour garantir des transactions fiables.'
    },
    {
      icone: '◎',
      titre: 'Réservation Sécurisée',
      description: 'Bloquez votre véhicule favori via un acompte sécurisé. Vos fonds sont protégés jusqu\'à l\'inspection finale.'
    },
    {
      icone: '⬡',
      titre: 'Expertise Douanière',
      description: 'Simulation en temps réel des frais de douane basés sur les grilles officielles de la DGDDI Bénin.'
    },
  ];

  constructor(
    private annonceService: AnnonceService,
    private marqueService: MarqueService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeatured();
    this.loadMarques();
  }

  loadFeatured(): void {
    this.isLoading.set(true);
    this.annonceService.getFeatured().subscribe({
      next: (data) => {
        this.annonces.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadMarques(): void {
    this.marqueService.getAll().subscribe({
      next: (data) => this.marques.set(data)
    });
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  getStatutDouanier(annonce: any): string {
    return annonce.vehicule?.statut_douanier === 'DEDOUANE' ? 'DÉDOUANÉ' : 'EN TRANSIT';
  }

  onSearch(): void {
    const queryParams: any = {};
    if (this.selectedMarque()) queryParams.marque_id = this.selectedMarque();
    if (this.selectedBudget()) queryParams.prix_max = this.selectedBudget();
    if (this.selectedStatut()) queryParams.statut_douanier = this.selectedStatut();

    this.router.navigate(['/catalogue'], { queryParams });
  }
}