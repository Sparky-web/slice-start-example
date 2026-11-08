import { createServerOnlyFn } from '@tanstack/react-start'

import { auth } from '../auth.server.ts'

/** Обрабатывает вход, регистрацию и выход. Работает только на сервере. */
export const handleAuthRequest = createServerOnlyFn((request: Request) => auth.handler(request))
