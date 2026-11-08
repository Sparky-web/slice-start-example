import { createFormHook } from '@tanstack/react-form'

import { CheckboxField } from './CheckboxField/CheckboxField.tsx'
import { Form } from './Form/Form.tsx'
import { fieldContext, formContext } from './formContext.ts'
import { FormError } from './FormError/FormError.tsx'
import { SelectField } from './SelectField/SelectField.tsx'
import { SubmitButton } from './SubmitButton/SubmitButton.tsx'
import { TextareaField } from './TextareaField/TextareaField.tsx'
import { TextField } from './TextField/TextField.tsx'

/**
 * Единственный способ собрать форму в приложении.
 * Поля дизайн-системы подключены заранее: модуль описывает только значения, проверки и отправку.
 * Отдельный помощник выносит повторяющуюся группу полей в отдельный блок.
 */
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, TextareaField, SelectField, CheckboxField },
  formComponents: { Form, SubmitButton, FormError },
})
