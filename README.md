# FSD Starter

Базовый шаблон для больших веб-приложений на React: TanStack Start (SSR на Vite), сквозная типизация через серверные функции и TanStack Query, Prisma, дизайн-система на токенах и строгие правила структуры кода.

Пример приложения на основе шаблона: [`fsd-starter-example`](../fsd-starter-example).

## Быстрый старт

```bash
pnpm install
cp apps/web/.env.example apps/web/.env   # укажите DATABASE_URL
pnpm --filter web db:push                # схема Prisma → база
pnpm dev                                 # http://localhost:3010
pnpm storybook                           # http://localhost:6006
```

Перед коммитом: `pnpm check` (токены, типы, линтеры, FSD, тесты, сборка).

## Стек

| Задача | Решение |
|---|---|
| Фреймворк | TanStack Start + Router (SSR, файловый роутинг, серверные функции), Vite 8 |
| Данные | TanStack Query, `createServerFn` + Zod, Prisma 7 (PostgreSQL) |
| Дизайн-система | `@repo/ui`: Base UI + Tailwind v4 + cva, токены из Figma (`@repo/tokens`) |
| Формы | TanStack Form `createFormHook`, поля из дизайн-системы |
| Таблицы | `DataTable` (TanStack Table v9 + Virtual + бесконечная подгрузка), `DataGrid` (AG Grid Community, MIT) |
| Утилиты | `@repo/lib`, es-toolkit, date-fns |
| Типографика | `typo()` и Vite-плагин: неразрывные пробелы после предлогов на этапе сборки |
| Качество | ESLint (strict-type-checked), Steiger, eslint-plugin-boundaries, dependency-cruiser, jscpd |
| Тесты | Vitest 5 (browser mode), Storybook 10, скриншоты в `screens/` |

## Структура

```
apps/web/                  приложение (FSD)
  prisma/schema.prisma
  src/
    app/                   роутер, файловые роуты (тонкие), стили
    pages/ widgets/ features/ entities/ shared/
packages/
  tokens/                  DTCG-токены из Figma → dist/theme.css
  ui/                      дизайн-система, формы, DataTable, DataGrid, Storybook
  lib/                     общие функции
  vitePlugins/             typoPlugin
  eslintConfig/            все правила, включая собственное repo/file-structure
  tsconfig/
```

## Правила

Всё ниже проверяет `pnpm lint`, нарушения ломают CI.

### Слои FSD

`app → pages → widgets → features → entities → shared`. Слой импортирует только нижние слои, слайсы одного слоя друг друга не импортируют. Импорт снаружи слайса — только через его `index.ts`. Проверяют `eslint-plugin-boundaries` (в редакторе) и Steiger (`pnpm --filter web lint:fsd`).

Бэкенд живёт в том же слайсе, что и UI:

```
entities/project/
  api/projectApi.ts        createServerFn + Prisma
  api/projectQueries.ts    queryOptions / infiniteQueryOptions
  model/projectSchema.ts   Zod-схемы, общие для клиента и сервера
  ui/ProjectCard/ProjectCard.tsx
  index.ts                 публичный API
```

Prisma доступна только через `~/shared/db` (`prisma.server.ts`). Импорт `*.server.*` в клиентский код TanStack Start запрещает на этапе сборки.

### Нейминг и инкапсуляция

- `.ts` — camelCase, `.tsx` — компоненты в PascalCase.
- Компонент лежит в своей папке: `Button/Button.tsx`, рядом `Button.story.tsx`, `Button.test.tsx`, `screens/`.
- Функция-хелпер в `lib` лежит в своей папке: `formatDate/formatDate.ts` и `formatDate.test.ts`.
- Папки в camelCase, PascalCase допустим только для папки компонента.

### Дизайн-система

- В `@theme` есть только токены, стандартная палитра и шкалы Tailwind сброшены. Классы вне токенов (`p-7`, `bg-red-500`) и произвольные значения (`w-[37px]`) — ошибка линтера.
- В приложении запрещены `style`, сырые `<button>`, `<input>`, `<a>`, `<p>`, `<h1>`… а также `clsx`, `cva`, `@base-ui/*`, `ag-grid-*` напрямую. Всё собирается из `@repo/ui`.
- Исключение оформляется точечно: `// eslint-disable-next-line <rule> -- причина`. Без описания причины линтер не пропустит.

### React

- `useEffect`, `useLayoutEffect`, `useInsertionEffect` запрещены. Данные загружаются в `loader` роута и через `useQuery`, на события реагируют в обработчиках, производные значения считаются во время рендера.
- `react-hooks`, `@eslint-react` (strict), TanStack Query и Router плагины.

## Токены и Figma

Источник правды — переменные в Figma (рекомендуется Obra shadcn/ui Community, имена совпадают с shadcn один к одному).

1. Экспортируйте переменные из Figma в формате W3C DTCG и положите в `packages/tokens/src/`:
   `primitives.tokens.json`, `theme.light.tokens.json`, `theme.dark.tokens.json`.
2. `pnpm tokens` → `packages/tokens/dist/theme.css`.
3. Закоммитьте оба изменения. `pnpm tokens:check` в CI падает, если CSS разошёлся с токенами.

## Формы

```tsx
const form = useAppForm({
  defaultValues: { title: '' },
  validators: { onChange: projectSchema },
  onSubmit: ({ value }) => createProject.mutateAsync(value),
})

<form.AppForm>
  <form.Form>
    <form.AppField name="title">{(field) => <field.TextField label="Название" />}</form.AppField>
    <form.SubmitButton>Создать</form.SubmitButton>
  </form.Form>
</form.AppForm>
```

Поля: `TextField`, `TextareaField`, `SelectField`, `CheckboxField`. Новое поле добавляется в `packages/ui/src/form/formHook.ts`.

## Таблицы

```tsx
const column = createDataTableColumns<Task>()
const columns = column.columns([column.accessor('title', { header: 'Название' })])

<DataTable columns={columns} query={taskQueries.list(filters)} getRowId={(task) => task.id} />
```

Серверная функция возвращает `DataPage<T>`: `{ items, nextCursor, total }`. Сортировку храните в search params роута.

## Скриншоты

Каждая история Storybook — визуальный тест. Эталоны лежат в `Component/screens/<story>-<platform>.png`.

```bash
pnpm --filter @repo/ui test          # сравнить
pnpm --filter @repo/ui test:update   # обновить эталоны
```

Эталоны зависят от платформы, поэтому в CI (`CI=1`) истории только рендерятся. Сравнивайте скриншоты локально или снимайте Linux-эталоны в контейнере `mcr.microsoft.com/playwright`.

## Команды

| Команда | Что делает |
|---|---|
| `pnpm dev` | dev-сервер приложения |
| `pnpm build` | сборка приложения и Storybook |
| `pnpm --filter web start` | запуск собранного приложения |
| `pnpm lint` | ESLint, Steiger, dependency-cruiser, jscpd |
| `pnpm typecheck` | TypeScript во всех пакетах |
| `pnpm test` | unit-, компонентные и скриншотные тесты |
| `pnpm tokens` | токены → CSS |
| `pnpm check` | всё перед коммитом |
