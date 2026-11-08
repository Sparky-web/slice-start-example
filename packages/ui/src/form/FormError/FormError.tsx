import { Alert } from '../../components/Alert/Alert.tsx'
import { useFormContext } from '../formContext.ts'

const formErrorText = (error: unknown): string | null => (typeof error === 'string' ? error : null)

/** Настройки ошибки формы. */
export interface FormErrorProps {
  /** Главная мысль ошибки. */
  title?: string
}

/** Ошибка всей формы после отправки, например чужой проект или нет связи с сервером. Ошибки полей видны под полями. */
export function FormError({ title = 'Не удалось сохранить' }: FormErrorProps) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => formErrorText(state.errorMap.onSubmit)}>
      {(error) =>
        error !== null ? (
          <Alert tone="destructive" title={title}>
            {error}
          </Alert>
        ) : null
      }
    </form.Subscribe>
  )
}
