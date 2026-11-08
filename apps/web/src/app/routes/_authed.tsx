import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { AppHeader } from '~/widgets/appHeader'

/** Закрытая часть сайта. Гость попадает на страницу входа и возвращается обратно после входа. */
export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context, location }) => {
    if (!context.user) throw redirect({ to: '/sign-in', search: { redirect: location.href } })
    return { user: context.user }
  },
  component: AuthedLayout,
})

function AuthedLayout() {
  const { user } = Route.useRouteContext()
  return (
    <>
      <AppHeader user={user} />
      <main>
        <Outlet />
      </main>
    </>
  )
}
