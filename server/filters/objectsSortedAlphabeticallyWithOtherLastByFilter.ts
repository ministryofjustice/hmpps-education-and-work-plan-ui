import enumComparator from '../data/mappers/enumComparator'

/**
 * Filter that takes an array of objects and returns an array sorted alphabetically on one of the properties (assumed to be an enum)
 * but with OTHER always last.
 *
 * This function is non-destructive. It returns a new array, and does not mutate the original array.
 */
const objectsSortedAlphabeticallyWithOtherLastByFilter = (
  unsortedArray: Array<object>,
  propertyToSortBy: string,
): Array<object> => {
  return [...unsortedArray].sort((left: object, right: object) =>
    enumComparator(objectProperty(left, propertyToSortBy), objectProperty(right, propertyToSortBy)),
  )
}

const objectProperty = <T extends string>(obj: object, propertyName: string): T =>
  Object.entries(obj).find(p => p[0] === propertyName)[1] as T

export default objectsSortedAlphabeticallyWithOtherLastByFilter
