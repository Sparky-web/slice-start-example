import type { Meta, StoryObj } from '@storybook/react-vite'

import { Heading } from '../Heading/Heading.tsx'
import { Stack } from '../Stack/Stack.tsx'
import { Text } from './Text.tsx'

const meta = {
  title: 'Foundations/Typography',
  component: Text,
  args: { children: 'Задача в работе с 5 января — по хорошему её нужно закрыть до пятницы.' },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Body: Story = {}

export const Scale: Story = {
  render: (args) => (
    <Stack gap={3}>
      <Heading level={1}>Заголовок первого уровня</Heading>
      <Heading level={2}>Заголовок второго уровня</Heading>
      <Heading level={3}>Заголовок третьего уровня</Heading>
      <Heading level={4}>Заголовок четвёртого уровня</Heading>
      <Text {...args} size="lg" />
      <Text {...args} />
      <Text {...args} size="sm" tone="muted" />
      <Text {...args} size="xs" tone="destructive" />
    </Stack>
  ),
}
