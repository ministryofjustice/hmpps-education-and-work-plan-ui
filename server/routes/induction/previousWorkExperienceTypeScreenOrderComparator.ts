import TypeOfWorkExperienceValue from '../../enums/typeOfWorkExperienceValue'

/**
 * Comparator that compares two [TypeOfWorkExperienceValue]'s and returns -1, 0 or 1 based on their relative position
 * within the screen order for Previous Work Experience types.
 *
 * The UI screens for Previous Work Experience presents the options in a specific order, which is not alphabetic. This
 * comparator can be used to sort an array of Previous Work Experience based on [TypeOfWorkExperienceValue] so that they
 * are in screen order.
 */
const previousWorkExperienceTypeScreenOrderComparator = (
  left: TypeOfWorkExperienceValue,
  right: TypeOfWorkExperienceValue,
): -1 | 0 | 1 => {
  const targetSortOrder = [
    TypeOfWorkExperienceValue.OUTDOOR,
    TypeOfWorkExperienceValue.CLEANING_AND_MAINTENANCE,
    TypeOfWorkExperienceValue.CONSTRUCTION,
    TypeOfWorkExperienceValue.DRIVING,
    TypeOfWorkExperienceValue.BEAUTY,
    TypeOfWorkExperienceValue.HOSPITALITY,
    TypeOfWorkExperienceValue.TECHNICAL,
    TypeOfWorkExperienceValue.MANUFACTURING,
    TypeOfWorkExperienceValue.OFFICE,
    TypeOfWorkExperienceValue.RETAIL,
    TypeOfWorkExperienceValue.SPORTS,
    TypeOfWorkExperienceValue.EDUCATION_TRAINING,
    TypeOfWorkExperienceValue.WAREHOUSING,
    TypeOfWorkExperienceValue.WASTE_MANAGEMENT,
    TypeOfWorkExperienceValue.OTHER,
  ]
  const leftIndex = targetSortOrder.indexOf(left)
  const rightIndex = targetSortOrder.indexOf(right)
  if (leftIndex < rightIndex) {
    return -1
  }
  if (leftIndex > rightIndex) {
    return 1
  }
  return 0
}

export default previousWorkExperienceTypeScreenOrderComparator
