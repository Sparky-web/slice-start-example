import { searchKey } from '@repo/lib'
import { createServerOnlyFn } from '@tanstack/react-start'

import { prisma } from '~/shared/db'

/** Параметры поиска задачи по названию. */
interface FindTaskByTitleParams {
  /** Проект, в котором ищем. */
  projectId: string
  /** Название. Регистр и буквы «ё» и «е» не важны. */
  title: string
  /** Задача, которую сейчас правят. Её название не считается занятым. */
  exceptId?: string
}

/** Ищет в проекте задачу с таким же названием. Два одинаковых названия путают команду. Работает только на сервере. */
export const findTaskByTitle = createServerOnlyFn(({ projectId, title, exceptId }: FindTaskByTitleParams) =>
  prisma.task.findFirst({
    where: { projectId, titleKey: searchKey(title), ...(exceptId ? { id: { not: exceptId } } : {}) },
    select: { id: true },
  }),
)
