import { Annonce } from "./annonce.model";

export enum StatutReservationEnum {
  EN_ATTENTE = "EN_ATTENTE",
  CONFIRMEE = "CONFIRMEE",
  ANNULEE = "ANNULEE",
  EXPIREE = "EXPIREE"
}

export interface Reservation {
  id: number;
  acheteur_id: number;
  annonce_id: number;
  annonce?: Annonce;
  montant_acompte: number;
  date_reservation: string;
  date_expiration: string;
  statut: StatutReservationEnum;
  document_reservation: string | null;
  date_creation: string;
}
