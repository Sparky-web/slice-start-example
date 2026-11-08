import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '../Badge/Badge.tsx'
import { Button } from '../Button/Button.tsx'
import { Text } from '../Text/Text.tsx'
import { Card } from './Card.tsx'

const meta = {
  title: 'Components/Card',
  component: Card,
  args: {
    title: 'Редизайн сайта',
    description: 'Обновить главную и страницу тарифов',
    actions: <Badge tone="success">Активен</Badge>,
    children: <Text size="sm">12 задач, 4 в работе</Text>,
    footer: <Button size="sm">Открыть</Button>,
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
