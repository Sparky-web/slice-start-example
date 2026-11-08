import { Button, Dialog } from '@repo/ui'
import { useAppForm, useSubmitAction } from '@repo/ui/form'
import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import type { ProjectInput } from '~/entities/project'
import { projectInputSchema, projectKeys } from '~/entities/project'

import { createProject } from '../../api/createProject.ts'
import { createProjectErrorMessage } from '../../model/createProjectErrors.ts'

const emptyProject: ProjectInput = { name: '', description: '' }

/** Создание проекта в диалоге. После создания пользователь сразу попадает в новый проект. */
export function CreateProjectDialog() {
  const navigate = useNavigate()
  const submit = useSubmitAction({
    action: (data: ProjectInput) => createProject({ data }),
    errorMessage: createProjectErrorMessage,
    invalidates: [projectKeys.all],
    onSuccess: ({ id }) => navigate({ to: '/projects/$projectId', params: { projectId: id } }),
  })
  const form = useAppForm({
    defaultValues: emptyProject,
    validators: { onChange: projectInputSchema, onSubmitAsync: submit },
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
          <form.FormError />
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
