import { queryOptions } from '@tanstack/react-query'

import { getServerStatus } from '~/shared/api'

export const homePageQueries = {
  status: () => queryOptions({ queryKey: ['serverStatus'], queryFn: () => getServerStatus() }),
}
