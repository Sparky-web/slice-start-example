import { Card, Container, Heading, Stack } from '@repo/ui'
import { getRouteApi } from '@tanstack/react-router'

import { EditProfileForm } from '~/features/editProfile'

const route = getRouteApi('/_authed/profile')

export function ProfilePage() {
  const { user } = route.useRouteContext()
  return (
    <Container padded size="sm">
      <Stack gap={6}>
        <Heading level={1}>Профиль</Heading>
        <Card>
          <EditProfileForm user={user} />
        </Card>
      </Stack>
    </Container>
  )
}
