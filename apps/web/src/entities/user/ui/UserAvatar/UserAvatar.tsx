import { Text } from '@repo/ui'

/** Настройки аватара. */
export interface UserAvatarProps {
  /** Имя пользователя. Аватар показывает первые буквы имени и фамилии. */
  name: string
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

/** Аватар пользователя из первых букв имени. Помогает быстро узнать свой аккаунт. */
export function UserAvatar({ name }: UserAvatarProps) {
  return (
    <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary">
      <Text size="xs" weight="semibold" render={<span />}>
        {initials(name)}
      </Text>
    </span>
  )
}
