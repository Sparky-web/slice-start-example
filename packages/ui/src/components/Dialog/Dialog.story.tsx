import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../Button/Button.tsx'
import { Text } from '../Text/Text.tsx'
import { Dialog } from './Dialog.tsx'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  args: {
    title: 'Новый проект',
    description: 'Проект объединяет задачи одной команды',
    trigger: <Button>Создать проект</Button>,
    children: <Text size="sm">Содержимое диалога</Text>,
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {}

export const Open: Story = { args: { open: true } }
