// Types generated to match schema.json for the questions database

/**
 * Represents a single question entry as defined in schema.json.
 *
 * @property question - The question in English.
 * @property answer - The correct answer to the question.
 * @property example - (Optional) Example usage of the answer.
 * @property slug - (Optional) Unique identifier for the question.
 * @property choices - (Optional) Answer choices for the question.
 * @property meaning - (Optional) The meaning of the question or answer, if applicable.
 */
export type Question = {
  question: string;
  answer: string;
  example?: string;
  choices?: string[];
  meaning?: string; // Added meaning field to match schema.json
  explanation?: string; // Explanation to show when the user selects the correct choice
  questionAudioBase64?: string; // Optional audio property for playback
};

/**
 * Represents the root object for a questions database file as defined in schema.json.
 *
 * @property $schema - Path to the schema file used to validate this database file.
 * @property title - Descriptive title for the question set.
 * @property language - Language of the questions, answers, and examples. Must be 'en'.
 * @property questions - List of questions with their answers and examples.
 */
export type QuestionsDB = {
  private?: boolean; // Added private property to match schema
  $schema?: string;
  title?: string;
  description?: string;
  slug?: string;
  language?: string;
  questionType?:
    | "fill_in_the_blank"
    | "definition_matching"
    | "synonym_selection"
    | "usage_in_context"
    | "sentence_transformation"
    | "multiple_choice_meaning"
    | "identify_phrasal_verb"
    | "error_correction";
  labels?: string[];
  questions: Question[];
};
