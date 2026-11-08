import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'

import { userKeys } from '~/entities/user'

/** После входа, регистрации и выхода обновляет данные пользователя на всех страницах и переводит на нужную страницу. */
export function useAuthRedirect() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const navigate = useNavigate()

  return async (to: string) => {
    await queryClient.resetQueries({ queryKey: userKeys.current })
    await router.invalidate()
    await navigate({ to })
  }
}
