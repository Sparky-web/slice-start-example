import { app, base, fsd, ignores, naming, react, tailwind } from '@repo/eslint-config'

export default [
  ...ignores,
  ...base(import.meta.dirname),
  ...react,

  // Naming and encapsulation: Component/Component.tsx, fnHelper/fnHelper.ts
  ...naming({ files: ['packages/lib/src/**/*.ts'], helpers: true }),
  ...naming({
    files: ['packages/{ui,vitePlugins}/src/**/*.{ts,tsx}', 'apps/*/src/**/*.{ts,tsx}'],
    ignores: ['apps/*/src/app/routes/**', 'apps/*/src/app/router.tsx'],
  }),

  // Design tokens only. The design system may use CSS variables for library internals.
  ...tailwind({ files: ['packages/ui/src/**/*.tsx'], entryPoint: 'packages/ui/src/styles/globals.css', strict: false }),
  ...tailwind({ files: ['apps/web/src/**/*.tsx'], entryPoint: 'apps/web/src/app/styles/app.css' }),

  // Application code is assembled from @repo/ui and follows FSD layers
  ...app({ files: ['apps/*/src/**/*.{ts,tsx}'] }),
  ...fsd({ files: ['apps/web/src/**/*.{ts,tsx}'], root: 'apps/web/src', tsconfig: 'apps/web/tsconfig.json' }),

  {
    files: ['**/scripts/**', '**/prisma/**', '**/*.config.{ts,js}'],
    rules: { 'no-console': 'off' },
  },
  {
    files: ['**/*.story.tsx', '**/*.test.{ts,tsx}', '**/.storybook/**'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      'max-lines': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
]
