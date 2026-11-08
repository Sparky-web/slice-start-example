import { Card, Container, Text, TextLink } from '@repo/ui'
import { getRouteApi, Link } from '@tanstack/react-router'

import { SignInForm } from '~/features/session'

const route = getRouteApi('/sign-in')

export function SignInPage() {
  const { redirect } = route.useSearch()
  return (
    <Container size="sm" padded>
      <Card
        title="Вход"
        description="Демо-доступ: demo@taskflow.dev / demo12345"
        footer={
          <Text size="sm" tone="muted">
            Нет аккаунта? <TextLink render={<Link to="/sign-up" />}>Зарегистрируйтесь</TextLink>
          </Text>
        }
      >
        <SignInForm {...(redirect === undefined ? {} : { redirectTo: redirect })} />
      </Card>
    </Container>
  )
}
