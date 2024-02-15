export default function formatMultilineTextFilter(value: string): string {
  if (!value) {
    return undefined
  }

  return value.replace(/\n/gm, '<br />')
}
