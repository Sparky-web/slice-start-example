import type { BadgeProps } from '@repo/ui'
import { Badge } from '@repo/ui'

import type { TaskPriority } from '../../model/taskSchema.ts'
import { taskPriorityLabels } from '../../model/taskSchema.ts'

const tones: Record<TaskPriority, BadgeProps['tone']> = { LOW: 'outline', MEDIUM: 'warning', HIGH: 'destructive' }

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge tone={tones[priority]}>{taskPriorityLabels[priority]}</Badge>
}
