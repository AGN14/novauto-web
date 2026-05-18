export enum StatutRendezVousEnum {
  PLANIFIE = "PLANIFIE",
  CONFIRME = "CONFIRME",
  ANNULE = "ANNULE"
}

export enum StatutDisponibiliteEnum {
  LIBRE = "LIBRE",
  OCCUPE = "OCCUPE"
}

export interface Disponibilite {
  id: number;
  vendeur_id: number;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  statut: StatutDisponibiliteEnum;
  date_creation: string;
}

export interface RendezVous {
  id: number;
  acheteur_id: number;
  annonce_id: number;
  disponibilite_id: number;
  date_heure: string;
  lieu: string;
  statut: StatutRendezVousEnum;
  motif_annulation: string | null;
  date_creation: string;
}
