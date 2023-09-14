export default function fallbackMessageFilter(value: string, fallback: string): string {
  return value?.trim() || fallback
}
