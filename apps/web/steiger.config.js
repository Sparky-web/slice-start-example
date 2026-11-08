import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // A slice used once today is still a separate business capability; merging hurts growth
    rules: { 'fsd/insignificant-slice': 'off' },
  },
  {
    // File routes mirror URLs (e.g. /api/auth/*), segment naming does not apply to them
    files: ['./src/app/routes/**'],
    rules: { 'fsd/no-reserved-folder-names': 'off' },
  },
  {
    ignores: ['./src/shared/db/generated/**', './src/**/screens/**', './src/app/routeTree.gen.ts'],
  },
])
