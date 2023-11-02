/**
 * Comparator function that compares ENUM strings, returning -1, 0 or 1 depending on whether the
 * first string is alphabetically before, equal or after the second sting.
 * If the first string is 'OTHER' then 1 is returned.
 *
 * This comparator function can be used to sort an array of ENUM strings, resulting in the array being sorted
 * alphabetically, except 'OTHER' which will always be at the end of the array.
 */
const enumComparator = (left: string, right: string): -1 | 0 | 1 => {
  if (left === 'OTHER') {
    return 1
  }
  if (right === 'OTHER') {
    return -1
  }
  if (left < right) {
    return -1
  }
  if (left > right) {
    return 1
  }
  return 0
}

export default enumComparator
