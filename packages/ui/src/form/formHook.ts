import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

import { CheckboxField } from './CheckboxField/CheckboxField.tsx'
import { Form } from './Form/Form.tsx'
import { fieldContext, formContext } from './formContext.ts'
import { FormError } from './FormError/FormError.tsx'
import { SelectField } from './SelectField/SelectField.tsx'
import { SubmitButton } from './SubmitButton/SubmitButton.tsx'
import { TextareaField } from './TextareaField/TextareaField.tsx'
import { TextField } from './TextField/TextField.tsx'

/**
 * The only form hook in the app. Fields from the design system are registered once,
 * modules use them as `<form.AppField name="title">{(field) => <field.TextField label="…" />}</form.AppField>`.
 */
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, TextareaField, SelectField, CheckboxField },
  formComponents: { Form, SubmitButton, FormError },
})

export { createFormHookContexts }
