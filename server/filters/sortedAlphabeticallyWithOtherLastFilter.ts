import enumComparator from '../data/mappers/enumComparator'

/**
 * Filter that takes an array of enum values and returns an array sorted alphabetically but with OTHER
 * always last.
 *
 * This function is non-destructive. It returns a new array, and does not mutate the original array.
 */
const sortedAlphabeticallyWithOtherLastFilter = <T extends string>(unsortedArray: Array<T>): Array<T> =>
  [...unsortedArray].sort(enumComparator)

export default sortedAlphabeticallyWithOtherLastFilter
