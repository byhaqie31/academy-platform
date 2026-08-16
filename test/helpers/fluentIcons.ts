import { icons } from '@iconify-json/fluent'

/** True if `name` (WITHOUT the `i-fluent-` prefix) exists in the Fluent set. */
export function fluentIconExists(name: string): boolean {
  return Boolean(icons.icons[name] ?? icons.aliases?.[name])
}

/** 'i-fluent-grid-24' -> 'grid-24' */
export function stripFluentPrefix(full: string): string {
  return full.replace(/^i-fluent-/, '')
}
