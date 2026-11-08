import { Card, Container, Text, TextLink } from '@repo/ui'
import { Link } from '@tanstack/react-router'

import { SignUpForm } from '~/features/session'

/** Страница регистрации. Пользователь с аккаунтом переходит отсюда ко входу. */
export function SignUpPage() {
  return (
    <Container size="sm" padded>
      <Card
        title="Регистрация"
        description="Аккаунт нужен, чтобы вести свои проекты"
        footer={
          <Text size="sm" tone="muted">
            Уже есть аккаунт? <TextLink render={<Link to="/sign-in" />}>Войдите</TextLink>
          </Text>
        }
      >
        <SignUpForm />
      </Card>
    </Container>
  )
}
