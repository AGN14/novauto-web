import { Vehicule } from "./vehicule.model";

export enum StatutAnnonceEnum {
  DISPONIBLE = "DISPONIBLE",
  RESERVEE = "RESERVEE",
  VENDUE = "VENDUE",
  EXPIREE = "EXPIREE"
}

export interface Annonce {
  id: number;
  vendeur_id: number;
  vehicule_id: number;
  vehicule?: Vehicule;
  titre: string;
  prix: number;
  statut: StatutAnnonceEnum;
  photos: string[];
  date_publication: string;
  date_modification: string;
}
