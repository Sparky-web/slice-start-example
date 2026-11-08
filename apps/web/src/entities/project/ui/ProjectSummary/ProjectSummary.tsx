import { formatNumber, pluralize } from '@repo/lib'
import { Badge, DateTime, Heading, Stack, Text } from '@repo/ui'
import type { ReactNode } from 'react'

import type { ProjectListItem } from '../../model/projectSchema.ts'

/** Настройки шапки проекта. */
export interface ProjectSummaryProps {
  /** Проект со счётчиками задач. */
  project: ProjectListItem
  /** Действия над проектом. */
  actions?: ReactNode
}

/** Шапка проекта: название, цель, число задач и доля готовых задач. */
export function ProjectSummary({ project, actions }: ProjectSummaryProps) {
  const progress = project.taskCount === 0 ? 0 : Math.round((project.doneCount / project.taskCount) * 100)
  return (
    <Stack direction="responsive" justify="between" gap={4}>
      <Stack gap={2}>
        <Heading level={1}>{project.name}</Heading>
        {project.description && <Text tone="muted">{project.description}</Text>}
        <Stack direction="row" gap={2} align="center" wrap>
          <Badge tone="outline">
            {formatNumber(project.taskCount)} {pluralize(project.taskCount, ['задача', 'задачи', 'задач'])}
          </Badge>
          <Badge tone={progress === 100 ? 'success' : 'info'}>Выполнено {progress}%</Badge>
          <Text size="sm" tone="muted">
            Создан <DateTime value={project.createdAt} />
          </Text>
        </Stack>
      </Stack>
      {actions !== undefined && (
        <Stack direction="row" gap={2} align="start">
          {actions}
        </Stack>
      )}
    </Stack>
  )
}
