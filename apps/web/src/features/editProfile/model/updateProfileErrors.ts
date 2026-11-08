/** Имена, которые путают с администрацией сайта. */
export const RESERVED_NAMES = ['администратор', 'поддержка', 'admin', 'support'] as const

/** Ожидаемые ошибки сохранения профиля. */
export interface UpdateProfileError {
  /** Код ошибки. */
  code: 'NAME_RESERVED'
  /** Ошибка относится к имени. */
  field: 'name'
  /** Занятое имя. */
  params: { name: string }
}

/** Текст ошибки сохранения профиля. */
export const updateProfileErrorMessage = (error: UpdateProfileError) =>
  `Имя «${error.params.name}» занято администрацией сайта. Выберите другое имя.`
