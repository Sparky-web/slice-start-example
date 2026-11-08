/** Часовой пояс, который пользователь выбрал на своём устройстве. */
export function deviceTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}
