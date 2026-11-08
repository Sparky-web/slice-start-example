import type { ActionResult } from '@repo/lib'
import { fail, ok } from '@repo/lib'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { z } from 'zod'

import { useAppForm } from '../formHook.ts'
import { useSubmitAction } from '../useSubmitAction.ts'

interface ProjectValues {
  name: string
}

type CreateProjectError = { code: 'NAME_TAKEN'; field: 'name'; params: { name: string } } | { code: 'LIMIT_REACHED'; params: { limit: number } }

const errorMessage = (error: CreateProjectError) => {
  switch (error.code) {
    case 'NAME_TAKEN': {
      return `Проект «${error.params.name}» уже есть`
    }
    case 'LIMIT_REACHED': {
      return `Можно создать не больше ${String(error.params.limit)} проектов`
    }
  }
}

interface ProjectFormProps {
  action: (values: ProjectValues) => Promise<ActionResult<{ id: string }, CreateProjectError>>
  onCreated: (id: string) => void
}

function ProjectForm({ action, onCreated }: ProjectFormProps) {
  const submit = useSubmitAction({
    action,
    errorMessage,
    onSuccess: ({ id }) => {
      onCreated(id)
    },
  })
  const form = useAppForm({
    defaultValues: { name: '' } satisfies ProjectValues,
    validators: { onChange: z.object({ name: z.string().min(2, 'Минимум 2 символа') }), onSubmitAsync: submit },
  })
  return (
    <form.AppForm>
      <form.Form>
        <form.FormError />
        <form.AppField name="name">{(field) => <field.TextField label="Название" />}</form.AppField>
        <form.SubmitButton>Создать</form.SubmitButton>
      </form.Form>
    </form.AppForm>
  )
}

const renderForm = (props: ProjectFormProps) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ProjectForm {...props} />
    </QueryClientProvider>,
  )

describe('form with a server action', () => {
  it('shows a field error from the server, hides it on edit and submits again', async () => {
    const action = vi.fn((values: ProjectValues) =>
      Promise.resolve(values.name === 'Сайт' ? fail({ code: 'NAME_TAKEN', field: 'name', params: { name: values.name } }) : ok({ id: '42' })),
    )
    const onCreated = vi.fn()
    const screen = await renderForm({ action, onCreated })

    await screen.getByLabelText('Название').fill('Сайт')
    await screen.getByRole('button', { name: 'Создать' }).click()
    await expect.element(screen.getByText('Проект «Сайт» уже есть')).toBeVisible()
    expect(onCreated).not.toHaveBeenCalled()

    await screen.getByLabelText('Название').fill('Сайт 2')
    await expect.element(screen.getByText('Проект «Сайт» уже есть')).not.toBeInTheDocument()

    await screen.getByRole('button', { name: 'Создать' }).click()
    await vi.waitFor(() => {
      expect(onCreated).toHaveBeenCalledWith('42')
    })
    expect(action).toHaveBeenCalledTimes(2)
  })

  it('shows a form error from the server and allows a retry', async () => {
    const action = vi.fn(() => Promise.resolve(fail({ code: 'LIMIT_REACHED', params: { limit: 3 } })))
    const screen = await renderForm({ action, onCreated: vi.fn() })

    await screen.getByLabelText('Название').fill('Сайт')
    await screen.getByRole('button', { name: 'Создать' }).click()
    await expect.element(screen.getByText('Можно создать не больше 3 проектов')).toBeVisible()

    await screen.getByRole('button', { name: 'Создать' }).click()
    await vi.waitFor(() => {
      expect(action).toHaveBeenCalledTimes(2)
    })
  })

  it('shows a network error when the server is unreachable', async () => {
    const action = vi.fn(() => Promise.reject(new TypeError('Failed to fetch')))
    const screen = await renderForm({ action, onCreated: vi.fn() })

    await screen.getByLabelText('Название').fill('Сайт')
    await screen.getByRole('button', { name: 'Создать' }).click()
    await expect.element(screen.getByText(/связаться/)).toBeVisible()
  })
})
