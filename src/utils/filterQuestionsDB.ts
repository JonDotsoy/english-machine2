import type { QuestionsDB } from "@/components/dto/question";

/**
 * Filters an array of QuestionsDB objects, returning only those with both a non-empty slug and title.
 * @param values Array of QuestionsDB objects to filter
 * @returns Filtered array of QuestionsDB objects
 */
export function filterQuestionsDB(
  values: QuestionsDB[],
  showPrivate: boolean = false,
): QuestionsDB[] {
  return values.filter((q) => {
    const privateValue = q.private ?? false; // Default to false if private is undefined
    const withTitle = Boolean(q.title);
    const withSlug = Boolean(q.slug);
    const allowReturn = !privateValue || showPrivate; // Allow return if not private or if showPrivate is true
    const isPublic = !privateValue; // Check if the question is public
    const isValid = withTitle && withSlug && (isPublic || allowReturn);
    return isValid;
  });
}
