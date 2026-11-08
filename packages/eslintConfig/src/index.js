import js from '@eslint/js'
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments/configs'
import eslintReact from '@eslint-react/eslint-plugin'
import pluginQuery from '@tanstack/eslint-plugin-query'
import pluginRouter from '@tanstack/eslint-plugin-router'
import betterTailwind from 'eslint-plugin-better-tailwindcss'
import boundaries from 'eslint-plugin-boundaries'
import reactHooks from 'eslint-plugin-react-hooks'
import noUselessEffect from 'eslint-plugin-react-you-might-not-need-an-effect'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { fileStructure } from './rules/fileStructure.js'
import { DATE_SYNTAX, effectMessage } from './shared.js'

const repoPlugin = {
  meta: { name: 'repo' },
  rules: {
    'file-structure': fileStructure,
  },
}

/** Arbitrary Tailwind values like `w-[37px]` or `text-[#fff]` bypass design tokens. */
const ARBITRARY_VALUE = String.raw`^.*\[(?!&)[^\[\]]*\](?!:).*$`
/** CSS variable shorthand like `p-(--x)`: allowed only inside the design system. */
const VARIABLE_VALUE = String.raw`^.*\(--[^)]*\)(?!:).*$`

/** Base rules for every TypeScript file. */
export const base = (tsconfigRootDir) => [
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintComments.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { projectService: true, tsconfigRootDir },
    },
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'separate-type-imports' }],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-explicit-any': 'error',
      // `as` hides type errors: use satisfies, type guards or generics. `as const` stays allowed.
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { ignoreRestSiblings: true, argsIgnorePattern: '^_', varsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      ],
      // TanStack Router control flow: `throw redirect(...)`, `throw notFound()`
      '@typescript-eslint/only-throw-error': [
        'error',
        {
          allow: [
            { from: 'package', package: '@tanstack/router-core', name: ['Redirect', 'NotFoundError'] },
            { from: 'package', package: '@tanstack/react-router', name: ['Redirect', 'NotFoundError'] },
          ],
        },
      ],
      '@eslint-community/eslint-comments/require-description': ['error', { ignore: [] }],
      '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
      '@eslint-community/eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      complexity: ['error', 15],
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-depth': ['error', 3],
      'max-params': ['error', 3],
      'no-nested-ternary': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', importNames: ['useEffect', 'useLayoutEffect', 'useInsertionEffect'], message: effectMessage },
            { name: 'lodash', message: 'Use es-toolkit or @repo/lib.' },
            { name: 'moment', message: 'Use date-fns via @repo/lib.' },
          ],
          patterns: [
            { group: ['lodash/*', 'lodash-es'], message: 'Use es-toolkit or @repo/lib.' },
            { group: ['ag-grid-enterprise', '@ag-grid-enterprise/*'], message: 'Only AG Grid Community (MIT) is allowed.' },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.name='React'][property.name=/^use(Layout|Insertion)?Effect$/]",
          message: effectMessage,
        },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
  },
]

/** React, hooks, effects, TanStack Query and Router rules. */
export const react = [
  {
    files: ['**/*.tsx'],
    ...eslintReact.configs['strict-type-checked'],
  },
  reactHooks.configs.flat['recommended-latest'],
  noUselessEffect.configs.strict,
  ...pluginQuery.configs['flat/recommended-strict'],
  ...pluginRouter.configs['flat/recommended'],
  {
    files: ['**/*.tsx'],
    rules: {
      '@eslint-react/no-unstable-default-props': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
]

/** File and folder naming plus component/helper encapsulation. */
export const naming = ({ files = ['**/src/**/*.{ts,tsx}'], ignores = [], helpers = false } = {}) => [
  {
    files,
    ignores,
    plugins: { repo: repoPlugin },
    rules: { 'repo/file-structure': ['error', { root: 'src', helpers }] },
  },
]

/**
 * Tailwind classes must come from design tokens.
 * `strict` also forbids `(--css-variable)` shorthands — use it everywhere except the design system.
 */
export const tailwind = ({ files, entryPoint, strict = true }) => [
  {
    files,
    plugins: { 'better-tailwindcss': betterTailwind },
    settings: { 'better-tailwindcss': { entryPoint } },
    rules: {
      ...betterTailwind.configs['correctness-error'].rules,
      'better-tailwindcss/enforce-consistent-class-order': 'error',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/no-unnecessary-whitespace': 'error',
      'better-tailwindcss/no-unknown-classes': 'error',
      'better-tailwindcss/no-restricted-classes': [
        'error',
        {
          restrict: [
            { pattern: ARBITRARY_VALUE, message: 'Arbitrary values bypass design tokens. Add a token or use a design system component.' },
            ...(strict ? [{ pattern: VARIABLE_VALUE, message: 'CSS variable values are reserved for the design system.' }] : []),
            { pattern: '^!.*|.*!$', message: '!important is forbidden.' },
          ],
        },
      ],
    },
  },
]

const RAW_ELEMENTS = 'button|input|select|textarea|table|form|a|h1|h2|h3|h4|h5|h6|p|label'

/**
 * Application code is assembled from the design system only:
 * no raw interactive/text elements, no inline styles, no styling libraries.
 */
export const app = ({ files }) => [
  {
    files,
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.name='React'][property.name=/^use(Layout|Insertion)?Effect$/]",
          message: effectMessage,
        },
        {
          selector: "JSXAttribute[name.name='style']",
          message: 'Inline styles bypass design tokens. Use design system props.',
        },
        {
          selector: `JSXOpeningElement[name.name=/^(${RAW_ELEMENTS})$/]`,
          message: 'Use design system components (Button, Input, Text, Heading, TextLink, DataTable, form.Form…) instead of raw elements.',
        },
        ...DATE_SYNTAX,
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', importNames: ['useEffect', 'useLayoutEffect', 'useInsertionEffect'], message: effectMessage },
            { name: 'lodash', message: 'Use es-toolkit or @repo/lib.' },
            { name: 'class-variance-authority', message: 'Variants live in the design system (@repo/ui).' },
            { name: 'clsx', message: 'Styling lives in the design system (@repo/ui).' },
            { name: 'tailwind-merge', message: 'Styling lives in the design system (@repo/ui).' },
            { name: '@tanstack/react-form', message: 'Use useAppForm from @repo/ui/form.' },
            { name: '@tanstack/react-table', message: 'Use DataTable from @repo/ui.' },
            { name: 'moment', message: 'Используйте Temporal.' },
            { name: 'dayjs', message: 'Используйте Temporal.' },
            { name: 'date-fns', message: 'Используйте Temporal и форматирование дат из @repo/lib.' },
          ],
          patterns: [
            { group: ['@base-ui/react', '@base-ui/react/*'], message: 'Use design system components from @repo/ui.' },
            { group: ['ag-grid-*', '@ag-grid-*/*'], message: 'Use DataGrid from @repo/ui/dataGrid.' },
            { group: ['lodash/*', 'lodash-es'], message: 'Use es-toolkit or @repo/lib.' },
            { group: ['date-fns/*'], message: 'Используйте Temporal и форматирование дат из @repo/lib.' },
            { group: ['@repo/*/src/*'], message: 'Import packages through their public entry points.' },
          ],
        },
      ],
    },
  },
]

const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

/**
 * Feature-Sliced Design: a layer imports only from layers below it,
 * slices of the same layer do not import each other.
 */
export const fsd = ({ files, root, tsconfig }) => [
  {
    files,
    plugins: { boundaries },
    settings: {
      'boundaries/include': [`${root}/**/*`],
      'boundaries/elements': [
        { type: 'app', pattern: `${root}/app` },
        ...LAYERS.slice(1, -1).map((layer) => ({ type: layer, pattern: `${root}/${layer}/*`, capture: ['slice'] })),
        { type: 'shared', pattern: `${root}/shared/*`, capture: ['segment'] },
      ],
      'import/resolver': { typescript: { alwaysTryTypes: true, project: tsconfig } },
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          message: `FSD: a layer may import only from layers below it (${LAYERS.join(' → ')}), slices of one layer are isolated.`,
          policies: LAYERS.map((layer, index) => ({
            from: { element: { type: layer } },
            allow: { to: { element: { types: [...LAYERS.slice(index + 1), ...(layer === 'shared' ? ['shared'] : [])] } } },
          })),
        },
      ],
      'boundaries/no-unknown-files': 'error',
    },
  },
]

export const ignores = [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.output/**',
      '**/.nitro/**',
      '**/.tanstack/**',
      '**/storybook-static/**',
      '**/coverage/**',
      '**/*.gen.ts',
      '**/generated/**',
    ],
  },
]

export { dates } from './dates.js'
export { docs } from './docs.js'
