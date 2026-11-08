import { Badge, Card, Container, DateTime, Heading, Stack, Text } from '@repo/ui'
import { useSuspenseQuery } from '@tanstack/react-query'

import { homePageQueries } from '../../api/homePageQueries.ts'

const features = [
  { title: 'TanStack Start', description: 'SSR, файловый роутинг и серверные функции на Vite' },
  { title: 'Prisma', description: 'Типизированная база данных прямо в серверных функциях' },
  { title: 'Дизайн-система', description: 'Токены из Figma, компоненты на Base UI и Tailwind' },
  { title: 'FSD и линтинг', description: 'Слои, имена файлов и чистота кода проверяются автоматически' },
] as const

/** Главная страница шаблона: что внутри и видит ли сайт базу данных. */
export function HomePage() {
  const { data: status } = useSuspenseQuery(homePageQueries.status())

  return (
    <Container padded>
      <Stack gap={8}>
        <Stack gap={3}>
          <Heading level={1}>Базовый шаблон для веб-приложений</Heading>
          <Text tone="muted" size="lg">
            Начните со слайса в src/entities или src/features — всё остальное уже настроено.
          </Text>
          <Stack direction="row" gap={2} align="center">
            <Badge tone={status.database === 'ok' ? 'success' : 'destructive'}>
              {status.database === 'ok' ? 'База данных подключена' : 'Нет подключения к базе'}
            </Badge>
            <Text size="sm" tone="muted">
              Проверено <DateTime value={status.checkedAt} preset="dateTime" />
            </Text>
          </Stack>
        </Stack>
        <Stack direction="responsive" gap={4} wrap>
          {features.map((feature) => (
            <Card key={feature.title} title={feature.title} description={feature.description} />
          ))}
        </Stack>
      </Stack>
    </Container>
  )
}
