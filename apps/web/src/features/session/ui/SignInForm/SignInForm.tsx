import { useAppForm, useSubmitAction } from '@repo/ui/form'

import type { SignInValues } from '../../api/sessionActions.ts'
import { signIn } from '../../api/sessionActions.ts'
import { signInSchema } from '../../model/authSchema.ts'
import { signInErrorMessage } from '../../model/sessionErrors.ts'
import { useAuthRedirect } from '../../model/useAuthRedirect.ts'

/** Настройки формы входа. */
export interface SignInFormProps {
  /** Страница, на которую пользователь вернётся после входа. */
  redirectTo?: string
}

const emptySignIn: SignInValues = { email: '', password: '' }

/** Вход по почте и паролю. После входа пользователь возвращается на страницу, с которой пришёл. */
export function SignInForm({ redirectTo = '/projects' }: SignInFormProps) {
  const redirect = useAuthRedirect()
  const submit = useSubmitAction({
    action: signIn,
    errorMessage: signInErrorMessage,
    onSuccess: () => redirect(redirectTo),
  })
  const form = useAppForm({
    defaultValues: emptySignIn,
    validators: { onChange: signInSchema, onSubmitAsync: submit },
  })

  return (
    <form.AppForm>
      <form.Form>
        <form.FormError title="Не удалось войти" />
        <form.AppField name="email">{(field) => <field.TextField label="Почта" type="email" autoComplete="email" />}</form.AppField>
        <form.AppField name="password">
          {(field) => <field.TextField label="Пароль" type="password" autoComplete="current-password" />}
        </form.AppField>
        <form.SubmitButton fullWidth>Войти</form.SubmitButton>
      </form.Form>
    </form.AppForm>
  )
}
