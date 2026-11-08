import type { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'

import { useAppForm } from '../formHook.ts'

const schema = z.object({
  title: z.string().min(3, 'Минимум 3 символа'),
  status: z.enum(['todo', 'done'], 'Выберите статус').nullable().refine((value) => value !== null, 'Выберите статус'),
  description: z.string(),
  urgent: z.boolean(),
})

const statuses = [
  { value: 'todo', label: 'К выполнению' },
  { value: 'done', label: 'Готово' },
] as const

interface DemoValues {
  title: string
  status: 'todo' | 'done' | null
  description: string
  urgent: boolean
}

const defaultValues: DemoValues = { title: '', status: null, description: '', urgent: false }

function DemoForm() {
  const form = useAppForm({
    defaultValues,
    validators: { onChange: schema },
    onSubmit: () => undefined,
  })
  return (
    <form.AppForm>
      <form.Form className="max-w-md">
        <form.AppField name="title">{(field) => <field.TextField label="Название" required />}</form.AppField>
        <form.AppField name="status">{(field) => <field.SelectField label="Статус" options={statuses} />}</form.AppField>
        <form.AppField name="description">{(field) => <field.TextareaField label="Описание" />}</form.AppField>
        <form.AppField name="urgent">{(field) => <field.CheckboxField label="Срочная задача" />}</form.AppField>
        <form.SubmitButton>Создать</form.SubmitButton>
      </form.Form>
    </form.AppForm>
  )
}

const meta = {
  title: 'Forms/AppForm',
  component: DemoForm,
} satisfies Meta<typeof DemoForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
