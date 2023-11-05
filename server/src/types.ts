import { CVV } from "./services/cvv";

export type Grade = {
  data: string;
  voto: string;
  materia: string;
  tipo: string;
  peso: string;
  descrizione: string;
};

export type User = {
  id: string;
  prevGrades: Grade[];
  cvv: CVV;
};
