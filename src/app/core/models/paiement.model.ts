export enum MoyenPaiementEnum {
  MOBILE_MONEY = "MOBILE_MONEY",
  CARTE_BANCAIRE = "CARTE_BANCAIRE"
}

export enum StatutPaiementEnum {
  EN_ATTENTE = "EN_ATTENTE",
  SUCCES = "SUCCES",
  ECHEC = "ECHEC"
}

export interface Paiement {
  id: number;
  reservation_id: number;
  acheteur_id: number;
  montant: number;
  moyen: MoyenPaiementEnum;
  statut: StatutPaiementEnum;
  reference_externe: string | null;
  date_transaction: string;
  recu: string | null;
}
