export enum TypeAvisEnum {
  AVIS_VENDEUR = "AVIS_VENDEUR",
  AVIS_VEHICULE = "AVIS_VEHICULE"
}

export enum StatutAvisEnum {
  PUBLIE = "PUBLIE",
  SIGNALE = "SIGNALE",
  SUPPRIME = "SUPPRIME"
}

export interface Avis {
  id: number;
  acheteur_id: number;
  vendeur_id: number;
  annonce_id: number;
  type: TypeAvisEnum;
  note: number;
  commentaire: string;
  signale: boolean;
  statut: StatutAvisEnum;
  date_publication: string;
}
