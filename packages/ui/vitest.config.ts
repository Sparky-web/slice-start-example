import path from 'node:path'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'
import type { BrowserConfigOptions } from 'vitest/node'

import viteConfig from './vite.config.ts'

const browser = (name: string): BrowserConfigOptions => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [{ browser: 'chromium', name, viewport: { width: 960, height: 640 } }],
  expect: {
    toMatchScreenshot: {
      comparatorName: 'pixelmatch',
      comparatorOptions: { allowedMismatchedPixelRatio: 0.01 },
      // Baselines live next to the component: Button/screens/<story>-<platform>.png
      resolveScreenshotPath: ({ root, testFileDirectory, arg, platform, ext }) =>
        path.join(root, testFileDirectory, 'screens', `${arg}-${platform}${ext}`),
    },
  },
})

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          plugins: [storybookTest({ configDir: path.join(import.meta.dirname, '.storybook') })],
          test: {
            name: 'storybook',
            browser: browser('storybook'),
            // Baselines are platform-specific: compare screenshots locally, only render stories in CI
            provide: { screenshots: process.env['CI'] === undefined },
            setupFiles: ['.storybook/vitest.setup.ts'],
          },
        },
        {
          extends: true,
          test: {
            name: 'unit',
            include: ['src/**/*.test.tsx'],
            browser: browser('unit'),
          },
        },
      ],
    },
  }),
)
