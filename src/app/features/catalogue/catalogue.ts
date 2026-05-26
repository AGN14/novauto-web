import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnonceService } from '../../core/services/annonce';
import { MarqueService } from '../../core/services/marque';
import { CustomSelect, SelectOption } from '../../shared/components/custom-select/custom-select';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, CustomSelect],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css'
})
export class Catalogue implements OnInit {

  annonces = signal<any[]>([]);
  marques = signal<any[]>([]);
  modeles = signal<any[]>([]);
  isLoading = signal(true);
  totalAnnonces = signal(0);
  currentPage = signal(1);
  lastPage = signal(1);
  filtreMarque = signal<string | null>(null);

  filtres = {
    marque_id: '',
    modele_id: '',
    statut_douanier: '',
    prix_max: '',
    vin_verifie: false,
  };

  budgets: SelectOption[] = [
    { label: 'Tous les budgets', value: '' },
    { label: 'Moins de 10 000 000 FCFA', value: '10000000' },
    { label: 'Moins de 20 000 000 FCFA', value: '20000000' },
    { label: 'Moins de 30 000 000 FCFA', value: '30000000' },
    { label: 'Moins de 50 000 000 FCFA', value: '50000000' },
  ];

  marqueOptions = signal<SelectOption[]>([]);
  modeleOptions = signal<SelectOption[]>([{ label: 'Tous les modèles', value: '' }]);
  statutOptions: SelectOption[] = [
    { label: 'Tous', value: '' },
    { label: 'Dédouané', value: 'DEDOUANE' },
    { label: 'En transit', value: 'EN_TRANSIT' }
  ];

  constructor(
    private annonceService: AnnonceService,
    private marqueService: MarqueService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMarques();

    // Lire le query param marque depuis l'URL
    this.route.queryParams.subscribe(params => {
      const marque = params['marque'] || null;
      this.filtreMarque.set(marque);
      this.loadAnnonces();
    });
  }

  loadMarques(): void {
    this.marqueService.getAll().subscribe({
      next: (data) => {
        this.marques.set(data);
        const options: SelectOption[] = [
          { label: 'Toutes les marques', value: '' },
          ...data.map(m => ({ label: m.nom, value: m.id.toString() }))
        ];
        this.marqueOptions.set(options);
      }
    });
  }

  loadAnnonces(page: number = 1): void {
    this.isLoading.set(true);
    const filters: any = { page, per_page: 12 };

    // Filtre par nom de marque (depuis carrousel)
    if (this.filtreMarque()) filters.marque = this.filtreMarque();

    if (this.filtres.marque_id) filters.marque_id = this.filtres.marque_id;
    if (this.filtres.modele_id) filters.modele_id = this.filtres.modele_id;
    if (this.filtres.statut_douanier) filters.statut_douanier = this.filtres.statut_douanier;
    if (this.filtres.prix_max) filters.prix_max = this.filtres.prix_max;
    if (this.filtres.vin_verifie) filters.vin_verifie = true;

    this.annonceService.getAll(filters).subscribe({
      next: (data) => {
        this.annonces.set(data.data);
        this.totalAnnonces.set(data.total);
        this.currentPage.set(data.current_page);
        this.lastPage.set(data.last_page);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onMarqueChange(value: any): void {
    this.filtres.marque_id = value;
    this.filtres.modele_id = '';
    this.modeles.set([]);
    this.modeleOptions.set([{ label: 'Tous les modèles', value: '' }]);

    if (this.filtres.marque_id) {
      this.marqueService.getModeles(+this.filtres.marque_id).subscribe({
        next: (data) => {
          this.modeles.set(data);
          const options: SelectOption[] = [
            { label: 'Tous les modèles', value: '' },
            ...data.map((m: any) => ({ label: m.nom, value: m.id.toString() }))
          ];
          this.modeleOptions.set(options);
        }
      });
    }
    this.loadAnnonces();
  }

  onModeleChange(value: any): void {
    this.filtres.modele_id = value;
    this.loadAnnonces();
  }

  onStatutChange(value: any): void {
    this.filtres.statut_douanier = value;
    this.loadAnnonces();
  }

  onBudgetChange(value: any): void {
    this.filtres.prix_max = value;
    this.loadAnnonces();
  }

  onFiltreChange(): void {
    this.loadAnnonces();
  }

  resetFiltres(): void {
    this.filtres = {
      marque_id: '',
      modele_id: '',
      statut_douanier: '',
      prix_max: '',
      vin_verifie: false,
    };
    this.modeles.set([]);
    this.loadAnnonces();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.lastPage()) {
      this.loadAnnonces(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  getStatutDouanier(annonce: any): string {
    return annonce.vehicule?.statut_douanier === 'DEDOUANE' ? 'DÉDOUANÉ' : 'EN TRANSIT';
  }
}