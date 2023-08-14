/**
 * Function that compares two dates, returning -1, 0 or 1 depending on whether the first date is before, equal to
 * or after the second date.
 */
export default (date1: Date, date2: Date): number => {
  if (date1 > date2) {
    return -1
  }
  if (date1 < date2) {
    return 1
  }
  return 0
}
