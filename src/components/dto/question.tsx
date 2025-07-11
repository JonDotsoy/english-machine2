// Tipo que representa una pregunta según schema.json

export type Question = {
  question: string;
  anwer: string; // typo intencional para coincidir con el esquema
  example?: string;
  choices?: string[];
};
