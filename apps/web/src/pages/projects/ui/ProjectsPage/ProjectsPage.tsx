import { Container, Heading, Stack, Text } from '@repo/ui'

import { CreateProjectDialog } from '~/features/createProject'
import { ProjectGrid } from '~/widgets/projectGrid'

export function ProjectsPage() {
  return (
    <Container padded size="xl">
      <Stack gap={6}>
        <Stack direction="responsive" justify="between" align="start" gap={4}>
          <Stack gap={1}>
            <Heading level={1}>Проекты</Heading>
            <Text tone="muted">Нажмите на проект, чтобы открыть его задачи</Text>
          </Stack>
          <CreateProjectDialog />
        </Stack>
        <ProjectGrid />
      </Stack>
    </Container>
  )
}
