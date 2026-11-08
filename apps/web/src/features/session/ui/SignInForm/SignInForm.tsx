import { useAppForm } from '@repo/ui/form'
import { useMutation } from '@tanstack/react-query'

import { authClient, unwrapAuth } from '~/shared/auth'

import { signInSchema } from '../../model/authSchema.ts'
import { useAuthRedirect } from '../../model/useAuthRedirect.ts'

export interface SignInFormProps {
  /** Where to go after a successful sign in. */
  redirectTo?: string
}

export function SignInForm({ redirectTo = '/projects' }: SignInFormProps) {
  const redirect = useAuthRedirect()
  const signIn = useMutation({
    mutationFn: (value: { email: string; password: string }) => unwrapAuth(authClient.signIn.email(value)),
    onSuccess: () => redirect(redirectTo),
  })
  const form = useAppForm({
    defaultValues: { email: '', password: '' },
    validators: { onChange: signInSchema },
    onSubmit: ({ value }) => signIn.mutateAsync(value),
  })

  return (
    <form.AppForm>
      <form.Form>
        <form.FormError error={signIn.error} title="Не удалось войти" />
        <form.AppField name="email">{(field) => <field.TextField label="Почта" type="email" autoComplete="email" />}</form.AppField>
        <form.AppField name="password">
          {(field) => <field.TextField label="Пароль" type="password" autoComplete="current-password" />}
        </form.AppField>
        <form.SubmitButton fullWidth>Войти</form.SubmitButton>
      </form.Form>
    </form.AppForm>
  )
}
