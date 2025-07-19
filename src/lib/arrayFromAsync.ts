/**
 * Utility to asynchronously map over an iterable and return a resolved array.
 * @param iterable - Iterable of items to process.
 * @param fn - Async function to apply to each item.
 * @returns Promise of resolved array.
 */
export async function arrayFromAsync<T, R>(
  iterable: Iterable<T>,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const arr = Array.from(iterable);
  return Promise.all(arr.map(fn));
}
