// Money is always shown pre-computed and formatted the Malaysian way.
export function formatRM(n: number): string {
  return 'RM ' + n.toLocaleString('en-MY')
}
