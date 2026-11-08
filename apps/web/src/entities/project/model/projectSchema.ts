import { z } from 'zod'

/** Fields of a project, shared by the create form and the server function. */
export const projectInputSchema = z.object({
  name: z.string().trim().min(2, 'Минимум 2 символа').max(80, 'Максимум 80 символов'),
  description: z.string().trim().max(500, 'Максимум 500 символов'),
})

export type ProjectInput = z.infer<typeof projectInputSchema>

export const projectSortFields = ['name', 'createdAt', 'taskCount'] as const

export const projectListInputSchema = z.object({
  offset: z.number().int().min(0),
  limit: z.number().int().min(1).max(200),
  sort: z.enum(projectSortFields).default('createdAt'),
  desc: z.boolean().default(true),
  search: z.string().trim().max(80).default(''),
})

export type ProjectListInput = z.input<typeof projectListInputSchema>

export interface ProjectListItem {
  id: string
  name: string
  description: string
  taskCount: number
  doneCount: number
  createdAt: string
}
