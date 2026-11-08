import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'

import { userQueries } from '~/entities/user'

/** After sign in/up/out: refresh the session in the cache and router context, then navigate. */
export function useAuthRedirect() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const navigate = useNavigate()

  return async (to: string) => {
    await queryClient.resetQueries({ queryKey: userQueries.current().queryKey })
    await router.invalidate()
    await navigate({ to })
  }
}
