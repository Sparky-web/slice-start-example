import type { Meta, StoryObj } from '@storybook/react-vite'

import { Stack } from '../Stack/Stack.tsx'
import { Badge } from './Badge.tsx'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Статус' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Tones: Story = {
  render: () => (
    <Stack direction="row" gap={2} wrap>
      <Badge tone="neutral">Черновик</Badge>
      <Badge tone="info">В работе</Badge>
      <Badge tone="success">Готово</Badge>
      <Badge tone="warning">На паузе</Badge>
      <Badge tone="destructive">Просрочено</Badge>
      <Badge tone="outline">Архив</Badge>
    </Stack>
  ),
}
