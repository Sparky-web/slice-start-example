import { createServerOnlyFn } from '@tanstack/react-start'

import { auth } from '../auth.server.ts'

/** Handles Better Auth HTTP endpoints (`/api/auth/*`). Server-only. */
export const handleAuthRequest = createServerOnlyFn((request: Request) => auth.handler(request))
