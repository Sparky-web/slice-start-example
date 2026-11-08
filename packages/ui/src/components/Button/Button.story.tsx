import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus } from 'lucide-react'

import { Stack } from '../Stack/Stack.tsx'
import { Button } from './Button.tsx'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Сохранить' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Variants: Story = {
  render: (args) => (
    <Stack direction="row" gap={2} wrap>
      <Button {...args} variant="primary" />
      <Button {...args} variant="secondary" />
      <Button {...args} variant="outline" />
      <Button {...args} variant="ghost" />
      <Button {...args} variant="destructive">
        Удалить
      </Button>
    </Stack>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap={2} align="center">
      <Button {...args} size="sm" />
      <Button {...args} size="md" />
      <Button {...args} size="lg" />
      <Button {...args} size="icon" aria-label="Добавить">
        <Plus className="size-4" />
      </Button>
    </Stack>
  ),
}

export const Loading: Story = { args: { loading: true } }
