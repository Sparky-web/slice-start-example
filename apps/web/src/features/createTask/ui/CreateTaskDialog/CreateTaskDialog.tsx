import { Button, Dialog } from '@repo/ui'
import { useAppForm } from '@repo/ui/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'

import { projectQueries } from '~/entities/project'
import type { TaskInput } from '~/entities/task'
import { emptyTaskInput, TaskFields, taskInputSchema, taskQueries } from '~/entities/task'

import { createTask } from '../../api/createTask.ts'

export function CreateTaskDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const create = useMutation({
    mutationFn: (input: TaskInput) => createTask({ data: { ...input, projectId } }),
    onSuccess: async () => {
      setOpen(false)
      form.reset()
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: taskQueries.all(projectId) }),
        queryClient.invalidateQueries({ queryKey: projectQueries.detail(projectId).queryKey }),
      ])
    },
  })
  const form = useAppForm({
    defaultValues: emptyTaskInput,
    validators: { onChange: taskInputSchema },
    onSubmit: ({ value }) => create.mutateAsync(value),
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
          <form.FormError error={create.error} />
          <TaskFields form={form} />
          <form.SubmitButton>Создать задачу</form.SubmitButton>
        </form.Form>
      </form.AppForm>
    </Dialog>
  )
}
