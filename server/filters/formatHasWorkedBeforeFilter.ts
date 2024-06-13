export default function formatHasWorkedBeforeFilter(value: string): string {
  if (value === null || value === undefined) {
    return undefined
  }
  if (typeof value === 'string') {
    if (value.toUpperCase() === 'YES') {
      return 'Yes'
    }
    if (value.toUpperCase() === 'NO') {
      return 'No'
    }
    if (value.toUpperCase() === 'NOT_RELEVANT') {
      return 'Not relevant'
    }
    return undefined
  }

  return undefined
}
