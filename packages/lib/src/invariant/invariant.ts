/** Останавливает работу с понятной ошибкой, когда нарушено условие, без которого продолжать нельзя. */
export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}
