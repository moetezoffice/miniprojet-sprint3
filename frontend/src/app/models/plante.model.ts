import { Type } from './type.model';

export interface Plante {
  id: number;
  nom: string;
  prix: number;
  dateCreation: string;
  type: Type;
}
