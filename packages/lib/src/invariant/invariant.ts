/**
 * Throws when the condition is falsy and narrows the type otherwise.
 *
 * @example invariant(user, 'User must be loaded')
 */
export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}
