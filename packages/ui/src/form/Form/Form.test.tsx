import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { z } from 'zod'

import { useAppForm } from '../formHook.ts'

function SignInForm({ onSubmit }: { onSubmit: (value: { email: string }) => void }) {
  const form = useAppForm({
    defaultValues: { email: '' },
    validators: { onSubmit: z.object({ email: z.email('Введите корректную почту') }) },
    onSubmit: ({ value }) => { onSubmit(value) },
  })
  return (
    <form.AppForm>
      <form.Form>
        <form.AppField name="email">{(field) => <field.TextField label="Почта" type="email" />}</form.AppField>
        <form.SubmitButton>Войти</form.SubmitButton>
      </form.Form>
    </form.AppForm>
  )
}

describe('AppForm', () => {
  it('shows schema errors and does not submit invalid values', async () => {
    const onSubmit = vi.fn()
    const screen = await render(<SignInForm onSubmit={onSubmit} />)
    await screen.getByRole('button', { name: 'Войти' }).click()
    await expect.element(screen.getByText('Введите корректную почту')).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits valid values', async () => {
    const onSubmit = vi.fn()
    const screen = await render(<SignInForm onSubmit={onSubmit} />)
    await screen.getByLabelText('Почта').fill('ivan@example.com')
    await screen.getByRole('button', { name: 'Войти' }).click()
    await vi.waitFor(() => { expect(onSubmit).toHaveBeenCalledWith({ email: 'ivan@example.com' }) })
  })
})
