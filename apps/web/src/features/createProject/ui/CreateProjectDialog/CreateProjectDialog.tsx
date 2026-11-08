import { Button, Dialog } from '@repo/ui'
import { useAppForm } from '@repo/ui/form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import type { ProjectInput } from '~/entities/project'
import { projectInputSchema } from '~/entities/project'

import { createProject } from '../../api/createProject.ts'

export function CreateProjectDialog() {
  const navigate = useNavigate()
  const create = useMutation({
    mutationFn: (data: ProjectInput) => createProject({ data }),
    onSuccess: ({ id }) => navigate({ to: '/projects/$projectId', params: { projectId: id } }),
  })
  const form = useAppForm({
    defaultValues: { name: '', description: '' } satisfies ProjectInput,
    validators: { onChange: projectInputSchema },
    onSubmit: ({ value }) => create.mutateAsync(value),
  })

  return (
    <Dialog
      title="Новый проект"
      description="Проект объединяет задачи одной команды или направления"
      trigger={
        <Button>
          <Plus className="size-4" />
          Новый проект
        </Button>
      }
    >
      <form.AppForm>
        <form.Form>
          <form.FormError error={create.error} />
          <form.AppField name="name">{(field) => <field.TextField label="Название" required />}</form.AppField>
          <form.AppField name="description">
            {(field) => <field.TextareaField label="Описание" placeholder="Цель проекта и ссылки на материалы" />}
          </form.AppField>
          <form.SubmitButton>Создать проект</form.SubmitButton>
        </form.Form>
      </form.AppForm>
    </Dialog>
  )
}
