import { useAppForm } from '@repo/ui/form'
import { useMutation } from '@tanstack/react-query'

import { authClient, unwrapAuth } from '~/shared/auth'

import { signUpSchema } from '../../model/authSchema.ts'
import { useAuthRedirect } from '../../model/useAuthRedirect.ts'

/** Регистрация по почте и паролю. После регистрации пользователь сразу попадает к своим проектам. */
export function SignUpForm() {
  const redirect = useAuthRedirect()
  const signUp = useMutation({
    mutationFn: (value: { name: string; email: string; password: string }) => unwrapAuth(authClient.signUp.email(value)),
    onSuccess: () => redirect('/projects'),
  })
  const form = useAppForm({
    defaultValues: { name: '', email: '', password: '', acceptTerms: false },
    validators: { onChange: signUpSchema },
    onSubmit: ({ value: { acceptTerms: _acceptTerms, ...value } }) => signUp.mutateAsync(value),
  })

  return (
    <form.AppForm>
      <form.Form>
        <form.FormError error={signUp.error} title="Не удалось зарегистрироваться" />
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
