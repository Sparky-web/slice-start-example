import { Dialog } from '@repo/ui'
import { useAppForm } from '@repo/ui/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { projectQueries } from '~/entities/project'
import type { TaskInput, TaskListItem } from '~/entities/task'
import { TaskFields, taskInputSchema, taskQueries, toTaskInput } from '~/entities/task'

import { updateTask } from '../../api/updateTask.ts'

/** Настройки диалога правки задачи. */
export interface EditTaskDialogProps {
  /** Проект задачи. После сохранения обновляются список и счётчики проекта. */
  projectId: string
  /** Задача для правки. Без задачи диалог закрыт. */
  task: TaskListItem | null
  /** Пользователь закрыл диалог или сохранил задачу. */
  onClose: () => void
}

/** Правка задачи в диалоге. Таблица и счётчики проекта обновляются после сохранения. */
export function EditTaskDialog({ projectId, task, onClose }: EditTaskDialogProps) {
  return (
    <Dialog
      open={task !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title="Редактирование задачи"
    >
      {task && <EditTaskForm key={task.id} projectId={projectId} task={task} onSaved={onClose} />}
    </Dialog>
  )
}

/** Настройки формы правки. */
interface EditTaskFormProps {
  /** Проект задачи. */
  projectId: string
  /** Задача с текущими значениями. */
  task: TaskListItem
  /** Задача сохранена. */
  onSaved: () => void
}

function EditTaskForm({ projectId, task, onSaved }: EditTaskFormProps) {
  const queryClient = useQueryClient()
  const update = useMutation({
    mutationFn: (input: TaskInput) => updateTask({ data: { ...input, id: task.id } }),
    onSuccess: async () => {
      onSaved()
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: taskQueries.all(projectId) }),
        queryClient.invalidateQueries({ queryKey: projectQueries.detail(projectId).queryKey }),
      ])
    },
  })
  const form = useAppForm({
    defaultValues: toTaskInput(task),
    validators: { onChange: taskInputSchema },
    onSubmit: ({ value }) => update.mutateAsync(value),
  })

  return (
    <form.AppForm>
      <form.Form>
        <form.FormError error={update.error} />
        <TaskFields form={form} />
        <form.SubmitButton>Сохранить</form.SubmitButton>
      </form.Form>
    </form.AppForm>
  )
}
