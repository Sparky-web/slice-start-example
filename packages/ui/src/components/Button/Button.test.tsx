import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { Button } from './Button.tsx'

describe('Button', () => {
  it('calls onClick', async () => {
    const onClick = vi.fn()
    const screen = await render(<Button onClick={onClick}>Сохранить</Button>)
    await screen.getByRole('button', { name: 'Сохранить' }).click()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled while loading', async () => {
    const screen = await render(<Button loading>Сохранить</Button>)
    await expect.element(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
  })
})
