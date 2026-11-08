import type { BadgeProps } from '@repo/ui'
import { Badge } from '@repo/ui'

import type { TaskPriority } from '../../model/taskSchema.ts'
import { taskPriorityLabels } from '../../model/taskSchema.ts'

const tones = { LOW: 'outline', MEDIUM: 'warning', HIGH: 'destructive' } as const satisfies Record<TaskPriority, BadgeProps['tone']>

/** Настройки метки срочности. */
export interface TaskPriorityBadgeProps {
  /** Срочность задачи. */
  priority: TaskPriority
}

/** Метка срочности задачи. Срочные задачи заметны в длинном списке. */
export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  return <Badge tone={tones[priority]}>{taskPriorityLabels[priority]}</Badge>
}
