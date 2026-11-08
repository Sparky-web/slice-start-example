import { afterEach, expect, inject } from 'vitest'
import { page } from 'vitest/browser'

/**
 * Every story is a visual test: the rendered story is compared with `Component/screens/<story>.png`.
 * Update baselines with `pnpm --filter @repo/ui test:update`.
 */
afterEach(async (context) => {
  if (!inject('screenshots') || context.task.result?.state === 'fail') return
  await document.fonts.ready
  const name = context.task.name.replaceAll(/[^\p{L}\p{N}]+/gu, '-').toLowerCase()
  await expect(page.elementLocator(document.body)).toMatchScreenshot(name)
})

declare module 'vitest' {
  export interface ProvidedContext {
    screenshots: boolean
  }
}
