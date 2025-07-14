// Tipo que representa una pregunta según schema.json

export type Question = {
  question: string;
  answer: string; // typo intencional para coincidir con el esquema
  example?: string;
  choices?: string[];
};
