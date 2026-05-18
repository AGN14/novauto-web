import { RoleEnum } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  email: string;
  password: string;
  password_confirmation: string;
  tel: string;
  role: RoleEnum;
  type_compte?: 'PROFESSIONNEL' | 'PARTICULIER';
  ifu?: string;
  nom_structure?: string;
  adresse_structure?: string;
  rccm?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: number;
  nom: string;
  email: string;
  role: RoleEnum;
  tel: string;
  mfa_actif: boolean;
  date_creation: string;
  vendeur?: VendeurProfile;
  acheteur?: AcheteurProfile;
}

export interface VendeurProfile {
  id: number;
  type_compte: 'PROFESSIONNEL' | 'PARTICULIER';
  certifie: boolean;
  date_certification: string | null;
  ifu: string | null;
  nom_structure: string | null;
  adresse_structure: string | null;
  rccm: string | null;
}

export interface AcheteurProfile {
  id: number;
}

export interface ApiError {
  message: string;
  errors?: { [key: string]: string[] };
}