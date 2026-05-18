export enum RoleEnum {
  VISITEUR = "VISITEUR",
  ACHETEUR = "ACHETEUR",
  VENDEUR = "VENDEUR",
  ADMINISTRATEUR = "ADMINISTRATEUR"
}

export enum TypeCompteEnum {
  PROFESSIONNEL = "PROFESSIONNEL",
  PARTICULIER = "PARTICULIER"
}

export interface User {
  id: number;
  nom: string;
  email: string;
  role: RoleEnum;
  tel: string;
  mfa_actif: boolean;
  date_creation: string;
}

export interface Acheteur extends User {
  historique_paiements: number[];
}

export interface Vendeur extends User {
  type_compte: TypeCompteEnum;
  certifie: boolean;
  date_certification: string | null;
  ifu: string | null;
  nom_structure: string | null;
  adresse_structure: string | null;
  rccm: string | null;
}

export interface Administrateur extends User {
  niveau_acces: number;
  journal_actions: string[];
}
