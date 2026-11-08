import { createFileRoute } from '@tanstack/react-router'

import { projectQueries } from '~/entities/project'
import { taskListSearchSchema, taskQueries } from '~/entities/task'
import { ProjectPage } from '~/pages/project'

/** Проект и его задачи. Сервер загружает первую порцию задач до показа страницы. */
export const Route = createFileRoute('/_authed/projects/$projectId')({
  validateSearch: taskListSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, params, deps }) => {
    const [project] = await Promise.all([
      context.queryClient.query(projectQueries.detail(params.projectId)),
      context.queryClient.infiniteQuery(taskQueries.list(params.projectId, deps.search)),
    ])
    return { title: project.name }
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.title ?? 'Проект'} — TaskFlow` }] }),
  component: ProjectPage,
})
