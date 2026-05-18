export interface GaragePartenaire {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  ville: string;
  agree: boolean;
  date_agrement: string | null;
  date_creation: string;
}
