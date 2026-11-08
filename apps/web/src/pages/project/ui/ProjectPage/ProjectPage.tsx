import { ButtonLink, Container, Stack } from '@repo/ui'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { projectQueries, ProjectSummary } from '~/entities/project'
import { TaskTable } from '~/widgets/taskTable'

const route = getRouteApi('/_authed/projects/$projectId')

/** Страница проекта: сводка и таблица задач. Отбор и порядок задач хранятся в адресе страницы. */
export function ProjectPage() {
  const { projectId } = route.useParams()
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { data: project } = useSuspenseQuery(projectQueries.detail(projectId))

  return (
    <Container padded size="xl">
      <Stack gap={6}>
        <ButtonLink variant="ghost" size="sm" render={<Link to="/projects" />} className="self-start">
          <ArrowLeft className="size-4" />
          Все проекты
        </ButtonLink>
        <ProjectSummary project={project} />
        <TaskTable
          projectId={projectId}
          search={search}
          onSearchChange={(next) => {
            void navigate({ search: next, replace: true })
          }}
        />
      </Stack>
    </Container>
  )
}
