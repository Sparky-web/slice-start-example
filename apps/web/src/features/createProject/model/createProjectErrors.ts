/** Сколько проектов может завести один пользователь. */
export const PROJECT_LIMIT = 100

/** Ожидаемые ошибки создания проекта. */
export type CreateProjectError =
  | { code: 'DUPLICATE_NAME'; field: 'name'; params: { name: string } }
  | { code: 'PROJECT_LIMIT_REACHED'; params: { limit: number } }

/** Тексты ошибок создания проекта. */
export function createProjectErrorMessage(error: CreateProjectError): string {
  switch (error.code) {
    case 'DUPLICATE_NAME': {
      return `Проект «${error.params.name}» у вас уже есть. Выберите другое название.`
    }
    case 'PROJECT_LIMIT_REACHED': {
      return `У вас уже ${String(error.params.limit)} проектов. Удалите старый проект, чтобы создать новый.`
    }
  }
}
