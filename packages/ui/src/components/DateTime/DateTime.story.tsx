import type { Meta, StoryObj } from '@storybook/react-vite'

import { TimeZoneProvider } from '../../timeZone/TimeZoneProvider/TimeZoneProvider.tsx'
import { Stack } from '../Stack/Stack.tsx'
import { Text } from '../Text/Text.tsx'
import { DateTime } from './DateTime.tsx'

const meta = {
  title: 'Components/DateTime',
  component: DateTime,
  args: { value: '2026-01-05T21:30:00.000Z', preset: 'dateTime' },
} satisfies Meta<typeof DateTime>

export default meta
type Story = StoryObj<typeof meta>

export const TimeZones: Story = {
  render: (args) => (
    <Stack gap={2}>
      {['Europe/Moscow', 'Asia/Vladivostok', 'America/New_York'].map((zone) => (
        <TimeZoneProvider key={zone} timeZone={zone} deviceGuess="UTC">
          <Text>
            {zone}: <DateTime {...args} />
          </Text>
        </TimeZoneProvider>
      ))}
      <TimeZoneProvider timeZone="Pacific/Kiritimati" deviceGuess="UTC">
        <Text>
          Календарная дата не сдвигается: <DateTime value="2026-01-05" preset="short" />
        </Text>
      </TimeZoneProvider>
    </Stack>
  ),
}
