export enum TypeNotificationEnum {
  RESERVATION_CONFIRMEE = "RESERVATION_CONFIRMEE",
  PAIEMENT_REUSSI = "PAIEMENT_REUSSI",
  PAIEMENT_ECHOUE = "PAIEMENT_ECHOUE",
  RDV_PLANIFIE = "RDV_PLANIFIE",
  RDV_CONFIRME = "RDV_CONFIRME",
  RDV_ANNULE = "RDV_ANNULE",
  RDV_RAPPEL = "RDV_RAPPEL",
  RESERVATION_EXPIREE = "RESERVATION_EXPIREE",
  VENDEUR_CERTIFIE = "VENDEUR_CERTIFIE",
  RAPPORT_SOUMIS = "RAPPORT_SOUMIS",
  RAPPORT_VALIDE = "RAPPORT_VALIDE",
  AVIS_PUBLIE = "AVIS_PUBLIE",
  AVIS_SUPPRIME = "AVIS_SUPPRIME",
  COMPTE_VENDEUR_CREE = "COMPTE_VENDEUR_CREE"
}

export enum CanalNotificationEnum {
  EMAIL = "EMAIL",
  SMS = "SMS"
}

export enum StatutEnvoiEnum {
  EN_ATTENTE = "EN_ATTENTE",
  ENVOYE = "ENVOYE",
  ECHOUE = "ECHOUE"
}

export interface Notification {
  id: number;
  destinataire_id: number;
  type: TypeNotificationEnum;
  canal: CanalNotificationEnum;
  sujet: string;
  contenu: string;
  statut_envoi: StatutEnvoiEnum;
  nombre_tentatives: number;
  date_envoi: string | null;
  date_creation: string;
}
