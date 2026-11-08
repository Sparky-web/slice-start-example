import type { BadgeProps } from '@repo/ui'
import { Badge } from '@repo/ui'

import type { TaskStatus } from '../../model/taskSchema.ts'
import { taskStatusLabels } from '../../model/taskSchema.ts'

const tones = { TODO: 'neutral', IN_PROGRESS: 'info', DONE: 'success' } as const satisfies Record<TaskStatus, BadgeProps['tone']>

/** Настройки метки этапа. */
export interface TaskStatusBadgeProps {
  /** Этап работы над задачей. */
  status: TaskStatus
}

/** Метка этапа задачи. Цвет помогает быстро найти задачи в работе и готовые задачи. */
export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  return <Badge tone={tones[status]}>{taskStatusLabels[status]}</Badge>
}
