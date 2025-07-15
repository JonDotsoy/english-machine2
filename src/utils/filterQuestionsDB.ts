import type { QuestionsDB } from "@/components/dto/question";

/**
 * Filters an array of QuestionsDB objects, returning only those with both a non-empty slug and title.
 * @param values Array of QuestionsDB objects to filter
 * @returns Filtered array of QuestionsDB objects
 */
export function filterQuestionsDB(values: QuestionsDB[]): QuestionsDB[] {
  return values.filter((q) => Boolean(q.title && q.slug));
}
