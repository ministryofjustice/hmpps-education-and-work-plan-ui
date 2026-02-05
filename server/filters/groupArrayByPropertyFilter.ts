/**
 * Simple nunjucks filter to group an array by the specified property values.
 * EG grouping the following array by the 'make' property:
 * [
 *   { make: 'VW', model: 'Golf' },
 *   { make: 'Ford', model: 'Escort' },
 *   { make: 'Ford', model: 'Cortina' },
 *   { make: 'VW', model: 'Polo' },
 *   { make: 'Ford', model: 'Sierra' },
 * ]
 *
 * would be returned as:
 * {
 *   VW: [
 *     { make: 'VW', model: 'Golf' },
 *     { make: 'VW', model: 'Polo' },
 *   ],
 *   Ford: [
 *     { make: 'Ford', model: 'Escort' },
 *     { make: 'Ford', model: 'Cortina' },
 *     { make: 'Ford', model: 'Sierra' },
 *   ]
 * }
 */
export default function groupArrayByPropertyFilter<T>(array: T[], property: string) {
  return array.reduce(
    (acc, item) => {
      const key = item[property as never]
      const currentEntry = acc[key] || ([] as T[])
      currentEntry.push(item)
      acc[key] = currentEntry
      return acc
    },
    {} as Record<string, Array<T>>,
  )
}
