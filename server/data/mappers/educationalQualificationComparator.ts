import type { EducationalQualification } from 'viewModels'

/**
 * Comparator function that compares two `EducationalQualification` view model instances, returning -1, 0 or 1 depending
 * on whether the first `EducationalQualification` is a higher level than the second `EducationalQualification`, with a
 * secondary comparison of the `EducationalQualification` subject alphabetically, and a tertiary comparison of the
 * `EducationalQualification` grade alphabetically.
 *
 * Determining whether a `EducationalQualification` is a "higher level" than another `EducationalQualification` is achieved
 * with a reverse alphabetic comparison on the `level` property. This works more by convenience than anything else because
 * the current supported levels are 'ENTRY_LEVEL' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5' | 'LEVEL_6' | 'LEVEL_7' | 'LEVEL_8'
 * If we were to add/rename levels where the alphabetic sorting did not represent their level then we would need to
 * revisit this.
 * Likewise, comparing and determining an order based on grade may need revisiting at some point - given that the grade
 * field is free text which is "better"? - A*, A, 1st, First, 9, 1 etc
 *
 * This comparator function can be used to sort an array of `EducationalQualification` view model instances, resulting
 * in the array being sorted alphabetically on the `level` property.
 */

const educationalQualificationComparator = (
  left: EducationalQualification,
  right: EducationalQualification,
): number => {
  if (left.level > right.level) {
    return -1
  }
  if (left.level < right.level) {
    return 1
  }

  // The level property of each EducationalQualification is equal. Apply a secondary comparison on the subject property.
  if (left.subject > right.subject) {
    return 1
  }
  if (left.subject < right.subject) {
    return -1
  }

  // The level and grade properties of each EducationalQualification is equal. Apply a tertiary comparison on the grade property.
  if (left.grade > right.grade) {
    return 1
  }
  if (left.grade < right.grade) {
    return -1
  }

  // The two EducationalQualification's have the same level, subject and grade.
  return 0
}

export default educationalQualificationComparator
