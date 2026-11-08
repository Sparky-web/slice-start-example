/** Ожидаемые ошибки входа. */
export type SignInError = { code: 'INVALID_CREDENTIALS'; field: 'password' } | { code: 'AUTH_FAILED' }

/** Ожидаемые ошибки регистрации. */
export type SignUpError = { code: 'EMAIL_TAKEN'; field: 'email'; params: { email: string } } | { code: 'AUTH_FAILED' }

const AUTH_FAILED = 'Сервис входа сейчас недоступен. Попробуйте через минуту.'

/** Тексты ошибок входа. Текст не раскрывает, есть ли аккаунт с такой почтой. */
export function signInErrorMessage(error: SignInError): string {
  switch (error.code) {
    case 'INVALID_CREDENTIALS': {
      return 'Неверная почта или пароль'
    }
    case 'AUTH_FAILED': {
      return AUTH_FAILED
    }
  }
}

/** Тексты ошибок регистрации. */
export function signUpErrorMessage(error: SignUpError): string {
  switch (error.code) {
    case 'EMAIL_TAKEN': {
      return `Аккаунт с почтой ${error.params.email} уже есть. Войдите или восстановите пароль.`
    }
    case 'AUTH_FAILED': {
      return AUTH_FAILED
    }
  }
}
