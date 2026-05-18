import { GaragePartenaire } from "./garage.model";

export enum StatutInspectionEnum {
  EN_ATTENTE = "EN_ATTENTE",
  APPROUVE = "APPROUVE",
  REJETE = "REJETE"
}

export interface RapportInspection {
  id: number;
  vehicule_id: number;
  garage_id: number;
  garage?: GaragePartenaire;
  date_inspection: string;
  etat_carrosserie: string;
  etat_moteur: string;
  etat_freins: string;
  etat_pneus: string;
  kilometrage_verifie: number;
  observations: string | null;
  statut: StatutInspectionEnum;
  date_soumission: string;
  date_validation: string | null;
}
