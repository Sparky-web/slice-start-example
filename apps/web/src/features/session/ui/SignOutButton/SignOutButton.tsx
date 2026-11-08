import { Button } from '@repo/ui'
import { useMutation } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'

import { authClient, unwrapAuth } from '~/shared/auth'

import { useAuthRedirect } from '../../model/useAuthRedirect.ts'

export function SignOutButton() {
  const redirect = useAuthRedirect()
  const signOut = useMutation({
    mutationFn: () => unwrapAuth(authClient.signOut()),
    onSuccess: () => redirect('/'),
  })

  return (
    <Button variant="ghost" size="sm" loading={signOut.isPending} onClick={() => { signOut.mutate() }}>
      <LogOut className="size-4" />
      Выйти
    </Button>
  )
}
