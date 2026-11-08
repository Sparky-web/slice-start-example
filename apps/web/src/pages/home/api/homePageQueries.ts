import { queryOptions } from '@tanstack/react-query'

import { getServerStatus } from '~/shared/api'

/** Данные главной страницы шаблона. */
export const homePageQueries = {
  status: () => queryOptions({ queryKey: ['serverStatus'], queryFn: () => getServerStatus() }),
}
