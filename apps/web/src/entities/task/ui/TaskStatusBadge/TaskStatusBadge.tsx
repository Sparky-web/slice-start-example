import type { BadgeProps } from '@repo/ui'
import { Badge } from '@repo/ui'

import type { TaskStatus } from '../../model/taskSchema.ts'
import { taskStatusLabels } from '../../model/taskSchema.ts'

const tones: Record<TaskStatus, BadgeProps['tone']> = { TODO: 'neutral', IN_PROGRESS: 'info', DONE: 'success' }

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Badge tone={tones[status]}>{taskStatusLabels[status]}</Badge>
}
