import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  override: {
    theme: {
      spacing: ['0', 'px', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32'],
    },
  },
})

/** Склеивает классы оформления. При конфликте побеждает последний класс. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
