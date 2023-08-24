export default function formatYesNoFilter(value: string | boolean): string {
  if (value === null || value === undefined) {
    return undefined
  }

  if (typeof value === 'boolean') {
    if (value === true) {
      return 'Yes'
    }
    return 'No'
  }

  if (typeof value === 'string') {
    if (value.toUpperCase() === 'YES' || value.toUpperCase() === 'Y') {
      return 'Yes'
    }
    if (value.toUpperCase() === 'NO' || value.toUpperCase() === 'N') {
      return 'No'
    }
    if (value.toUpperCase() === 'NOT_SURE') {
      return 'Not sure'
    }
    return undefined
  }

  return undefined
}
