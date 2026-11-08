import { Alert, Field, Input } from '@repo/ui'
import { useAppForm } from '@repo/ui/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { z } from 'zod'

import type { SessionUser } from '~/entities/user'
import { userNameSchema, userQueries } from '~/entities/user'

import { updateProfile } from '../../api/updateProfile.ts'

export function EditProfileForm({ user }: { user: SessionUser }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const update = useMutation({
    mutationFn: (data: { name: string }) => updateProfile({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueries.current().queryKey })
      await router.invalidate()
    },
  })
  const form = useAppForm({
    defaultValues: { name: user.name },
    validators: { onChange: z.object({ name: userNameSchema }) },
    onSubmit: ({ value }) => update.mutateAsync(value),
  })

  return (
    <form.AppForm>
      <form.Form>
        <form.FormError error={update.error} />
        {update.isSuccess && <Alert tone="success" title="Профиль сохранён" />}
        <Field label="Почта" description="Почту изменить нельзя">
          <Input value={user.email} disabled />
        </Field>
        <form.AppField name="name">{(field) => <field.TextField label="Имя" autoComplete="name" />}</form.AppField>
        <form.SubmitButton>Сохранить</form.SubmitButton>
      </form.Form>
    </form.AppForm>
  )
}
