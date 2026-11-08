import type { Meta, StoryObj } from '@storybook/react-vite'

import { Stack } from '../Stack/Stack.tsx'
import { Alert } from './Alert.tsx'

const meta = {
  title: 'Components/Alert',
  component: Alert,
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Tones: Story = {
  render: () => (
    <Stack gap={3}>
      <Alert tone="info" title="Подсказка">
        Данные обновляются раз в минуту.
      </Alert>
      <Alert tone="success" title="Сохранено" />
      <Alert tone="destructive" title="Не удалось сохранить">
        Проверьте соединение и попробуйте ещё раз.
      </Alert>
    </Stack>
  ),
}
