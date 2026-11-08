import { Button, Dialog } from '@repo/ui'
import { useAppForm, useSubmitAction } from '@repo/ui/form'
import { Plus } from 'lucide-react'
import { useState } from 'react'

import { projectKeys } from '~/entities/project'
import type { TaskInput } from '~/entities/task'
import { emptyTaskInput, TaskFields, taskInputSchema, taskKeys } from '~/entities/task'

import { createTask } from '../../api/createTask.ts'
import { createTaskErrorMessage } from '../../model/createTaskErrors.ts'

/** Настройки диалога новой задачи. */
export interface CreateTaskDialogProps {
  /** Проект, в который пользователь добавляет задачу. */
  projectId: string
}

/** Создание задачи в диалоге. Новая задача сразу появляется в таблице, счётчики проекта обновляются. */
export function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const submit = useSubmitAction({
    action: (input: TaskInput) => createTask({ data: { ...input, projectId } }),
    errorMessage: createTaskErrorMessage,
    invalidates: [taskKeys.project(projectId), projectKeys.detail(projectId)],
    onSuccess: () => {
      setOpen(false)
      form.reset()
    },
  })
  const form = useAppForm({
    defaultValues: emptyTaskInput,
    validators: { onChange: taskInputSchema, onSubmitAsync: submit },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Новая задача"
      trigger={
        <Button>
          <Plus className="size-4" />
          Задача
        </Button>
      }
    >
      <form.AppForm>
        <form.Form>
          <form.FormError />
          <TaskFields form={form} />
          <form.SubmitButton>Создать задачу</form.SubmitButton>
        </form.Form>
      </form.AppForm>
    </Dialog>
  )
}
