/** True when an icon string is an Iconify name ('i-...') rather than an emoji or initial. */
export function isFluentIcon(icon: string): boolean {
  return icon.startsWith('i-')
}
