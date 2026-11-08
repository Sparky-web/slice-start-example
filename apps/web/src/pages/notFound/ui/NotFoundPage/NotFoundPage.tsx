import { ButtonLink, Container, EmptyState } from '@repo/ui'
import { Link } from '@tanstack/react-router'

export function NotFoundPage() {
  return (
    <Container padded size="sm">
      <EmptyState
        title="Страница не найдена"
        description="Возможно, её удалили или в адресе опечатка."
        action={<ButtonLink render={<Link to="/" />}>На главную</ButtonLink>}
      />
    </Container>
  )
}
