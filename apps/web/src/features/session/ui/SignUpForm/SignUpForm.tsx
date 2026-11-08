import { useAppForm, useSubmitAction } from '@repo/ui/form'

import { signUp } from '../../api/sessionActions.ts'
import { signUpSchema } from '../../model/authSchema.ts'
import { signUpErrorMessage } from '../../model/sessionErrors.ts'
import { useAuthRedirect } from '../../model/useAuthRedirect.ts'

const emptySignUp = { name: '', email: '', password: '', acceptTerms: false }

/** Регистрация по почте и паролю. После регистрации пользователь сразу попадает к своим проектам. */
export function SignUpForm() {
  const redirect = useAuthRedirect()
  const submit = useSubmitAction({
    action: ({ acceptTerms: _acceptTerms, ...values }: typeof emptySignUp) => signUp(values),
    errorMessage: signUpErrorMessage,
    onSuccess: () => redirect('/projects'),
  })
  const form = useAppForm({
    defaultValues: emptySignUp,
    validators: { onChange: signUpSchema, onSubmitAsync: submit },
  })

  return (
    <form.AppForm>
      <form.Form>
        <form.FormError title="Не удалось зарегистрироваться" />
        <form.AppField name="name">{(field) => <field.TextField label="Имя" autoComplete="name" />}</form.AppField>
        <form.AppField name="email">{(field) => <field.TextField label="Почта" type="email" autoComplete="email" />}</form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextField label="Пароль" type="password" autoComplete="new-password" description="Не меньше 8 символов" />
          )}
        </form.AppField>
        <form.AppField name="acceptTerms">
          {(field) => <field.CheckboxField label="Согласен с условиями использования" />}
        </form.AppField>
        <form.SubmitButton fullWidth>Зарегистрироваться</form.SubmitButton>
      </form.Form>
    </form.AppForm>
  )
}
