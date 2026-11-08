# TaskFlow — пример приложения на Slice Start

Минимальный трекер задач, на котором видны все возможности [Slice Start](https://github.com/Sparky-web/slice-start): авторизация, формы, таблицы, сквозная типизация и FSD с бэкендом в слайсах.

Репозиторий: [Sparky-web/slice-start-example](https://github.com/Sparky-web/slice-start-example). Лицензия — [MIT](LICENSE).

Репозиторий сохраняет историю шаблона. Чтобы получить обновления, добавьте шаблон как `upstream` один раз:

```bash
git remote add upstream https://github.com/Sparky-web/slice-start.git
```

Затем получайте изменения:

```bash
git pull upstream main
```

## Запуск

Установите Node.js 24 или новее, pnpm 9.15.1 и PostgreSQL.

```bash
git clone https://github.com/Sparky-web/slice-start-example.git
cd slice-start-example
cp apps/web/.env.example apps/web/.env
```

Укажите `DATABASE_URL`, `BETTER_AUTH_SECRET` и `BETTER_AUTH_URL` в `.env`.
Сгенерируйте секрет командой `openssl rand -hex 32` и запишите результат в `BETTER_AUTH_SECRET`.
Создайте базу PostgreSQL. Для локального PostgreSQL выполните `createdb taskflow`.

Создайте `.env` до установки зависимостей: Prisma читает `DATABASE_URL` при генерации клиента.

```bash
pnpm install --frozen-lockfile
pnpm --filter web db:push
pnpm --filter web db:seed
pnpm dev
```

Откройте `http://localhost:3020`. Демо-вход: `demo@taskflow.dev` / `demo12345`.
`BETTER_AUTH_URL` должен совпадать с адресом, на котором открыто приложение.

Перед первым запуском тестов установите браузер: `pnpm --filter @repo/ui exec playwright install chromium`.

## Что где показано

| Возможность | Где смотреть |
|---|---|
| Регистрация, вход, выход (Better Auth + Prisma) | `features/session`, `shared/auth`, `app/routes/api/auth/$.ts` |
| Защищённые роуты и редирект гостя | `app/routes/_authed.tsx`, `app/routes/sign-in.tsx` |
| Серверные функции с проверкой сессии | `shared/auth/authMiddleware`, `entities/*/api`, `features/*/api` |
| SSR и SEO | `app/routes/index.tsx` (`head`), loader в `app/routes/_authed/projects/$projectId.tsx` |
| Формы: валидация Zod, ошибки сервера, чекбокс, select, дата | `features/session`, `features/createProject`, `features/editProfile` |
| Переиспользуемая группа полей (`withForm`) | `entities/task/ui/TaskFields` → `features/createTask`, `features/editTask` |
| `DataTable`: бесконечная подгрузка, сортировка и фильтры в URL | `widgets/taskTable`, `entities/task/api` |
| `DataGrid` (AG Grid Community): блочная подгрузка, серверная сортировка и фильтр | `widgets/projectGrid` |
| Типографика | весь русский текст в JSX: неразрывные пробелы ставит `typoPlugin` при сборке |
| Часовой пояс пользователя | `features/editProfile` (выбор в профиле), `shared/auth` (поле пользователя), `app/routes/__root.tsx` |
| Temporal: срок задачи — календарная дата, создание — момент | `entities/task/model`, `shared/lib/dbDates` |
| Типизированные ошибки действий у полей формы | `features/*/model/*Errors.ts`, `features/*/api`, `features/session/api/sessionActions.ts` |
| Ключи кэша и запросы раздельно | `entities/*/api/*Queries.ts`: `taskKeys` и `taskQueries` |
| Поиск и дубли без учёта регистра и «ё» | `nameKey`, `titleKey` в схеме, `searchKey` из `@repo/lib` |
| Общий контракт списков для таблицы и грида | `entities/task/api/taskApi.ts`, `entities/project/api/projectApi.ts` |

## Слайсы

```
entities/  user      текущий пользователь, аватар, схема имени
           project   список и карточка проекта, счётчики задач
           task      список задач, схемы, бейджи, поля формы
features/  session        вход, регистрация, выход
           createProject  диалог и серверная функция
           createTask     диалог и серверная функция
           editTask       редактирование по клику на строку
           editProfile    смена имени
widgets/   appHeader, taskTable, projectGrid
pages/     home, signIn, signUp, projects, project, profile, notFound
shared/    auth (Better Auth), db (Prisma), config
```

Каждый слайс экспортирует публичный API через `index.ts`. Серверный код лежит рядом с UI того же слайса, а клиентский бандл его не получает: тела `createServerFn` и `createServerOnlyFn` вырезаются при сборке, `*.server.ts` защищён import protection.

Проверка перед коммитом: `pnpm check`. Правила для людей и ИИ-агентов: [AGENTS.md](AGENTS.md).
