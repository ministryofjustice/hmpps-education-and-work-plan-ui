import type { AchievedQualificationDto } from 'inductionDto'
import achievedQualificationComparator from '../data/mappers/achievedQualificationComparator'

/**
 * Filter that takes an array of AchievedQualificationDto objects and returns an array sorted in screen display order.
 *
 * The UI screens display educational qualifications in a qualification level order. This filter can be used to sort an
 * array of [AchievedQualificationDto] based on [QualificationLevelValue] so that they are in screen order.
 *
 * Determining whether a qualification is a "higher level" than another qualification is achieved with a reverse
 * alphabetic comparison on the `level` property. This works more by convenience than anything else because the current
 * supported levels are 'ENTRY_LEVEL' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5' | 'LEVEL_6' | 'LEVEL_7' | 'LEVEL_8'
 * If we were to add/rename levels where the alphabetic sorting did not represent their level then we would need to
 * revisit this.
 * Likewise, comparing and determining an order based on grade may need revisiting at some point - given that the grade
 * field is free text which is "better"? - A*, A, 1st, First, 9, 1 etc
 *
 * This function is non-destructive. It returns a new array, and does not mutate the original array.
 */
const achievedQualificationObjectsSortedInScreenOrderFilter = (
  unsortedArray: Array<AchievedQualificationDto>,
): Array<object> => {
  return [...unsortedArray].sort(achievedQualificationComparator)
}

export default achievedQualificationObjectsSortedInScreenOrderFilter
