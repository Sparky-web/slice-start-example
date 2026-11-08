import { ButtonLink, Card, Container, Heading, Stack, Text } from '@repo/ui'
import { getRouteApi, Link } from '@tanstack/react-router'

const rootRoute = getRouteApi('__root__')

const features = [
  { title: 'Проекты', description: 'Грид на AG Grid Community с фильтром и сортировкой на сервере' },
  { title: 'Задачи', description: 'Таблица с бесконечной подгрузкой, фильтры и сортировка живут в адресе' },
  { title: 'Формы', description: 'Создание и редактирование на TanStack Form с полями из дизайн-системы' },
] as const

export function HomePage() {
  const { user } = rootRoute.useRouteContext()

  return (
    <Container padded>
      <Stack gap={12}>
        <Stack gap={4} align="start">
          <Heading level={1}>TaskFlow — задачи команды в одном месте</Heading>
          <Text tone="muted" size="lg">
            Пример приложения на FSD Starter: авторизация, проекты и задачи с сервером в том же слайсе.
          </Text>
          <Stack direction="row" gap={2} wrap>
            {user ? (
              <ButtonLink size="lg" render={<Link to="/projects" />}>
                Открыть проекты
              </ButtonLink>
            ) : (
              <>
                <ButtonLink size="lg" render={<Link to="/sign-up" />}>
                  Создать аккаунт
                </ButtonLink>
                <ButtonLink size="lg" variant="outline" render={<Link to="/sign-in" />}>
                  Войти
                </ButtonLink>
              </>
            )}
          </Stack>
        </Stack>
        <Stack direction="responsive" gap={4}>
          {features.map((feature) => (
            <Card key={feature.title} title={feature.title} description={feature.description} className="flex-1" />
          ))}
        </Stack>
      </Stack>
    </Container>
  )
}
