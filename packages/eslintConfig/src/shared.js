export const effectMessage =
  'Effects are forbidden: load data in route loaders / useQuery, react to events in handlers, derive values during render. ' +
  'For a rare external subscription use useSyncExternalStore.'

/** Dates are Temporal only: the legacy Date object mixes time zones and mutates in place. */
export const DATE_SYNTAX = [
  {
    selector: "NewExpression[callee.name='Date']",
    message: 'Используйте Temporal: Temporal.Now.instant(), Temporal.PlainDate.from(...). Date допустим только на границе с базой данных.',
  },
  {
    selector: "MemberExpression[object.name='Date'][property.name=/^(now|parse|UTC)$/]",
    message: 'Используйте Temporal.Now.instant() и Temporal.Instant.from(...).',
  },
]
