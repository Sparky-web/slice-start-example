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

Правила для людей и ИИ-агентов: [AGENTS.md](AGENTS.md).

## Стек

| Задача | Решение |
|---|---|
| Фреймворк | TanStack Start + Router (SSR, файловый роутинг, серверные функции), Vite 8 |
| Данные | TanStack Query, `createServerFn` + Zod, Prisma 7 (PostgreSQL) |
| Дизайн-система | `@repo/ui`: Base UI + Tailwind v4 + cva, токены из Figma (`@repo/tokens`) |
| Формы | TanStack Form `createFormHook`, поля из дизайн-системы |
| Таблицы | `DataTable` (TanStack Table v9 + Virtual + бесконечная подгрузка), `DataGrid` (AG Grid Community, MIT) |
| Даты | Temporal с полифилом для браузеров и сервера без поддержки, настройка часового пояса |
| Утилиты | `@repo/lib`, es-toolkit |
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

### Документация и типы

- JSDoc обязателен для экспортов и пропсов: русский язык, продуктовый смысл, упрощённый технический русский. Проверяют `eslint-plugin-jsdoc` и собственное правило `repo-docs/jsdoc-product`.
- Пропсы компонента — `interface …Props` в файле компонента (`repo-docs/component-props-interface`).
- `as` запрещён, кроме `as const`. Используйте `satisfies`, проверки типов и Zod.

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

Сервер возвращает итог `ok(data)` или типизированную ошибку `fail({ code, field, params })`. Форма показывает ошибку поля под полем, общую — над формой.

```tsx
type CreateTaskError =
  | { code: 'PROJECT_NOT_FOUND' }
  | { code: 'DUPLICATE_TITLE'; field: 'title'; params: { title: string } }

const createTaskErrorMessage = (error: CreateTaskError) => {
  switch (error.code) {
    case 'PROJECT_NOT_FOUND': return 'Проект удалён или недоступен'
    case 'DUPLICATE_TITLE': return `Задача «${error.params.title}» уже есть`
  }
}

const submit = useSubmitAction({
  action: (value) => createTask({ data: { ...value, projectId } }),
  errorMessage: createTaskErrorMessage,
  invalidates: [taskKeys.project(projectId)],
  onSuccess: () => setOpen(false),
})
const form = useAppForm({ defaultValues, validators: { onChange: taskInputSchema, onSubmitAsync: submit } })

<form.AppForm>
  <form.Form>
    <form.FormError />
    <form.AppField name="title">{(field) => <field.TextField label="Название" />}</form.AppField>
    <form.SubmitButton>Создать</form.SubmitButton>
  </form.Form>
</form.AppForm>
```

Новый код ошибки без текста не проходит проверку типов: `switch` обязан покрыть все коды. Поля: `TextField`, `TextareaField`, `SelectField`, `CheckboxField`.

## Данные и кэш

У каждой сущности два объекта в `api`: `taskKeys` — только ключи кэша для сброса, `taskQueries` — только описания запросов для чтения. Подробнее в [AGENTS.md](AGENTS.md).

## Таблицы

`DataTable` и `DataGrid` используют один контракт: `ListRequest` (`offset`, `limit`, `sort`, `desc`, `filters`) → `ListPage` (`items`, `total`).

```ts
// Сервер: только условия доступа и вид строки
export const listTasks = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(listRequestSchema(taskFiltersSchema).extend({ projectId: z.string() }))
  .handler(async ({ data, context }) => {
    const where = { projectId: data.projectId, project: { ownerId: context.user.id } }
    const [rows, total] = await prisma.$transaction([
      prisma.task.findMany({ where, ...pageArgs(data, taskSortFields, 'createdAt') }),
      prisma.task.count({ where }),
    ])
    return { items: rows.map(toTaskItem), total }
  })

// Клиент
const query = listQueryOptions({ queryKey: ['tasks', search], fetchPage: (page) => listTasks({ data: { ...page, ...search } }) })
<DataTable columns={columns} query={query} getRowId={(task) => task.id} />
```

Генератор серверных функций сознательно не используется: компилятор TanStack Start находит `createServerFn` только на верхнем уровне модуля, а условия доступа должны быть видны в каждой функции.

## Даты и часовой пояс

- Только Temporal: `new Date()`, `Date.now()` и библиотеки дат запрещены линтером.
- Полифил подгружается до старта роутера только там, где нет встроенного Temporal (Node 24, старые браузеры).
- Часовой пояс показа: настройка пользователя → `APP_TIME_ZONE` сайта → пояс устройства.
- Пояс устройства браузер сохраняет в cookie, поэтому со второго визита сервер сразу рисует даты в нужном поясе. При первом визите компонент даты переключается на пояс устройства после загрузки без ошибки гидрации.

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
