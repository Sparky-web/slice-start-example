import { Alert } from '../../components/Alert/Alert.tsx'

export interface FormErrorProps {
  /** Usually `mutation.error`. Nothing is rendered when empty. */
  error: unknown
  title?: string
}

/** Form-level error, e.g. a failed server request. */
export function FormError({ error, title = 'Не удалось сохранить' }: FormErrorProps) {
  if (error === null || error === undefined) return null
  const message = error instanceof Error ? error.message : 'Попробуйте ещё раз'
  return (
    <Alert tone="destructive" title={title}>
      {message}
    </Alert>
  )
}
