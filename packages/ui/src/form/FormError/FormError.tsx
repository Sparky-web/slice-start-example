import { Alert } from '../../components/Alert/Alert.tsx'

/** Настройки ошибки формы. */
export interface FormErrorProps {
  /** Ошибка последней отправки. Без ошибки блок не виден. */
  error: unknown
  /** Главная мысль ошибки. */
  title?: string
}

/** Ошибка всей формы, например отказ сервера. Пользователь видит причину и может повторить отправку. */
export function FormError({ error, title = 'Не удалось сохранить' }: FormErrorProps) {
  if (error === null || error === undefined) return null
  const message = error instanceof Error ? error.message : 'Попробуйте ещё раз'
  return (
    <Alert tone="destructive" title={title}>
      {message}
    </Alert>
  )
}
