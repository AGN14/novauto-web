export enum StatutDouanierEnum {
  DEDOUANE = "DEDOUANE",
  EN_TRANSIT = "EN_TRANSIT"
}

export interface Marque {
  id: number;
  nom: string;
  pays_origine: string | null;
  date_creation: string;
}

export interface Modele {
  id: number;
  marque_id: number;
  marque?: Marque;
  nom: string;
  type_carrosserie: string | null;
  date_creation: string;
}

export interface Vehicule {
  id: number;
  modele_id: number;
  modele?: Modele;
  vin: string;
  annee: number;
  kilometrage: number;
  statut_douanier: StatutDouanierEnum;
  vin_verifie: boolean;
  date_creation: string;
}
