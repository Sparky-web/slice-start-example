import { timeZoneOptions } from '@repo/lib'
import { Alert, Field, Input } from '@repo/ui'
import { useAppForm } from '@repo/ui/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import type { z } from 'zod'

import type { SessionUser } from '~/entities/user'
import { DEVICE_TIME_ZONE, userQueries } from '~/entities/user'

import { profileSchema, updateProfile } from '../../api/updateProfile.ts'

/** Настройки формы профиля. */
export interface EditProfileFormProps {
  /** Пользователь, который меняет свой профиль. */
  user: SessionUser
}

const timeZoneChoices = () => [{ value: DEVICE_TIME_ZONE, label: 'Как на устройстве' }, ...timeZoneOptions()]

/** Форма профиля: имя и часовой пояс, в котором пользователь видит даты. Почта видна, но не меняется. */
export function EditProfileForm({ user }: EditProfileFormProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const update = useMutation({
    mutationFn: (data: z.infer<typeof profileSchema>) => updateProfile({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueries.current().queryKey })
      await router.invalidate()
    },
  })
  const form = useAppForm({
    defaultValues: { name: user.name, timeZone: user.timeZone ?? DEVICE_TIME_ZONE },
    validators: { onChange: profileSchema },
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
        <form.AppField name="timeZone">
          {(field) => (
            <field.SelectField label="Часовой пояс" description="Все даты и время на сайте показываются в этом поясе" options={timeZoneChoices()} />
          )}
        </form.AppField>
        <form.SubmitButton>Сохранить</form.SubmitButton>
      </form.Form>
    </form.AppForm>
  )
}
