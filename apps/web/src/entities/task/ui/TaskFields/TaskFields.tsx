import { Stack } from '@repo/ui'
import { withForm } from '@repo/ui/form'

import { emptyTaskInput, taskPriorityOptions, taskStatusOptions } from '../../model/taskSchema.ts'

/**
 * Поля задачи: название, описание, этап, срочность и срок.
 * Создание и правка задачи используют одни и те же поля.
 */
export const TaskFields = withForm({
  defaultValues: emptyTaskInput,
  render: function TaskFieldsRender({ form }) {
    return (
      <>
        <form.AppField name="title">{(field) => <field.TextField label="Название" required />}</form.AppField>
        <form.AppField name="description">{(field) => <field.TextareaField label="Описание" />}</form.AppField>
        <Stack direction="responsive" gap={4}>
          <Stack grow>
            <form.AppField name="status">{(field) => <field.SelectField label="Статус" options={taskStatusOptions} />}</form.AppField>
          </Stack>
          <Stack grow>
            <form.AppField name="priority">
              {(field) => <field.SelectField label="Приоритет" options={taskPriorityOptions} />}
            </form.AppField>
          </Stack>
        </Stack>
        <form.AppField name="dueDate">{(field) => <field.TextField label="Срок" type="date" />}</form.AppField>
      </>
    )
  },
})
