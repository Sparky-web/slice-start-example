import { ButtonLink, Container, Stack, Text, TextLink } from '@repo/ui'
import { Link } from '@tanstack/react-router'

import type { SessionUser } from '~/entities/user'
import { UserAvatar } from '~/entities/user'
import { SignOutButton } from '~/features/session'

export function AppHeader({ user }: { user: SessionUser }) {
  return (
    <header className="border-b bg-card">
      <Container size="xl">
        <Stack direction="row" align="center" justify="between" gap={4} className="py-3">
          <Stack direction="row" align="center" gap={6}>
            <TextLink render={<Link to="/projects" />} className="no-underline">
              TaskFlow
            </TextLink>
            <Stack render={<nav />} direction="row" gap={1}>
              <ButtonLink variant="ghost" size="sm" render={<Link to="/projects" activeProps={{ 'aria-current': 'page' }} />}>
                Проекты
              </ButtonLink>
              <ButtonLink variant="ghost" size="sm" render={<Link to="/profile" />}>
                Профиль
              </ButtonLink>
            </Stack>
          </Stack>
          <Stack direction="row" align="center" gap={3}>
            <UserAvatar name={user.name} />
            <Text size="sm" weight="medium" className="hidden sm:block">
              {user.name}
            </Text>
            <SignOutButton />
          </Stack>
        </Stack>
      </Container>
    </header>
  )
}
