import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule, Calculator, Info, Download, RotateCcw } from 'lucide-angular';
import { CustomSelect, SelectOption } from '../../shared/components/custom-select/custom-select';

@Component({
  selector: 'app-simulateur',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, CustomSelect],
  templateUrl: './simulateur.html',
  styleUrl: './simulateur.css'
})
export class Simulateur implements OnInit {

  readonly Calculator = Calculator;
  readonly Info = Info;
  readonly Download = Download;
  readonly RotateCcw = RotateCcw;

  prixFOB = signal<number | null>(null);
  anneeVehicule = signal<number>(new Date().getFullYear());
  cylindree = signal<string>('moins2000');
  typeVehicule = signal<string>('tourisme');

  tauxDouane = computed(() => {
    switch (this.cylindree()) {
      case 'moins2000': return 0.25;
      case '2000a3000': return 0.30;
      case 'plus3000':  return 0.35;
      default:          return 0.25;
    }
  });

  droitsDouane = computed(() => {
    if (!this.prixFOB()) return 0;
    return Math.round(this.prixFOB()! * this.tauxDouane());
  });

  tva = computed(() => {
    if (!this.prixFOB()) return 0;
    return Math.round((this.prixFOB()! + this.droitsDouane()) * 0.18);
  });

  cncb = computed(() => {
    if (!this.prixFOB()) return 0;
    return Math.round(this.prixFOB()! * 0.0075);
  });

  pvi = computed(() => {
    if (!this.prixFOB()) return 0;
    return Math.round(this.prixFOB()! * 0.01);
  });

  manutention = signal(150000);
  anatt = signal(85000);

  totalFrais = computed(() => {
    return this.droitsDouane() + this.tva() + this.cncb() + this.pvi() + this.manutention() + this.anatt();
  });

  coutTotal = computed(() => {
    if (!this.prixFOB()) return 0;
    return this.prixFOB()! + this.totalFrais();
  });

  annees = computed(() => {
    const annees = [];
    const current = new Date().getFullYear();
    for (let i = current; i >= current - 20; i--) {
      annees.push(i);
    }
    return annees;
  });

  anneeOptions = computed<SelectOption[]>(() => {
    return this.annees().map(annee => ({
      value: annee.toString(),
      label: annee.toString()
    }));
  });

  typeOptions: SelectOption[] = [
    { value: 'tourisme', label: 'Tourisme' },
    { value: 'utilitaire', label: 'Utilitaire' },
    { value: 'pickup', label: 'Pick-up' }
  ];

  hasResult = computed(() => this.prixFOB() !== null && this.prixFOB()! > 0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['prix']) {
        this.prixFOB.set(parseFloat(params['prix']));
      }
    });
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  reset(): void {
    this.prixFOB.set(null);
    this.anneeVehicule.set(new Date().getFullYear());
    this.cylindree.set('moins2000');
    this.typeVehicule.set('tourisme');
  }

  onPrixChange(event: any): void {
    const val = parseFloat(event.target.value);
    this.prixFOB.set(isNaN(val) ? null : val);
  }

  onAnneeChange(value: any): void {
    this.anneeVehicule.set(parseInt(value));
  }

  onTypeChange(value: any): void {
    this.typeVehicule.set(value);
  }
}