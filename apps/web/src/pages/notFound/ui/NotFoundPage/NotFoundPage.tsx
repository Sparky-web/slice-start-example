import { ButtonLink, Container, EmptyState } from '@repo/ui'
import { Link } from '@tanstack/react-router'

/** Страница для неверного адреса. Пользователь возвращается на главную одной кнопкой. */
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
