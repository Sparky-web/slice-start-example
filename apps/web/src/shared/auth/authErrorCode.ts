/** Код отказа сервиса авторизации, например неверный пароль или занятая почта. */
export function authErrorCode(error: unknown): string | undefined {
  return typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string' ? error.code : undefined
}
