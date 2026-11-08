import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Input } from '../Input/Input.tsx'
import { Select } from '../Select/Select.tsx'
import { Stack } from '../Stack/Stack.tsx'
import { Textarea } from '../Textarea/Textarea.tsx'
import { Field } from './Field.tsx'

const meta = {
  title: 'Components/Field',
  component: Field,
  args: { label: 'Название', children: null },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

const statuses = [
  { value: 'todo', label: 'К выполнению' },
  { value: 'done', label: 'Готово' },
] as const

function Controls() {
  const [status, setStatus] = useState<'todo' | 'done' | null>(null)
  return (
    <Stack gap={4} className="max-w-md">
      <Field label="Название" description="Коротко и по делу" required>
        <Input placeholder="Например, редизайн сайта" />
      </Field>
      <Field label="Почта" errors={['Введите корректную почту']}>
        <Input defaultValue="ivan@" />
      </Field>
      <Field label="Статус">
        <Select options={statuses} value={status} onValueChange={setStatus} />
      </Field>
      <Field label="Описание">
        <Textarea placeholder="Что нужно сделать" />
      </Field>
    </Stack>
  )
}

export const Controlled: Story = { render: () => <Controls /> }
