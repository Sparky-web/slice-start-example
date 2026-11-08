import { timeZoneOptions } from '@repo/lib'
import { Alert, Field, Input } from '@repo/ui'
import { useAppForm, useSubmitAction } from '@repo/ui/form'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import type { z } from 'zod'

import type { SessionUser } from '~/entities/user'
import { DEVICE_TIME_ZONE, userKeys } from '~/entities/user'

import { profileSchema, updateProfile } from '../../api/updateProfile.ts'
import { updateProfileErrorMessage } from '../../model/updateProfileErrors.ts'

/** Настройки формы профиля. */
export interface EditProfileFormProps {
  /** Пользователь, который меняет свой профиль. */
  user: SessionUser
}

const timeZoneChoices = () => [{ value: DEVICE_TIME_ZONE, label: 'Как на устройстве' }, ...timeZoneOptions()]

/** Форма профиля: имя и часовой пояс, в котором пользователь видит даты. Почта видна, но не меняется. */
export function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const submit = useSubmitAction({
    action: (data: z.infer<typeof profileSchema>) => updateProfile({ data }),
    errorMessage: updateProfileErrorMessage,
    invalidates: [userKeys.current],
    onSuccess: async () => {
      setSaved(true)
      // Часовой пояс задаёт каркас страницы, поэтому роутер перечитывает пользователя
      await router.invalidate()
    },
  })
  const form = useAppForm({
    defaultValues: { name: user.name, timeZone: user.timeZone ?? DEVICE_TIME_ZONE },
    validators: { onChange: profileSchema, onSubmitAsync: submit },
    listeners: {
      onChange: () => {
        setSaved(false)
      },
    },
  })

  return (
    <form.AppForm>
      <form.Form>
        <form.FormError />
        {saved && <Alert tone="success" title="Профиль сохранён" />}
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
