import { isTimeZone } from '@repo/lib'
import { z } from 'zod'

/** Имя пользователя: от 2 до 60 символов. */
export const userNameSchema = z.string().trim().min(2, 'Минимум 2 символа').max(60, 'Максимум 60 символов')

/** Значение выбора «как на устройстве» в настройке часового пояса. */
export const DEVICE_TIME_ZONE = 'device'

/** Часовой пояс из настроек профиля: существующий пояс или пояс устройства. */
export const userTimeZoneSchema = z.string().refine((value) => value === DEVICE_TIME_ZONE || isTimeZone(value), 'Выберите часовой пояс')
