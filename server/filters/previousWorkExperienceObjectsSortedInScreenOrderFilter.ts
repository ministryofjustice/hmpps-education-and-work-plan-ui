import type { PreviousWorkExperienceDto } from 'inductionDto'
import previousWorkExperienceTypeScreenOrderComparator from '../routes/induction/previousWorkExperienceTypeScreenOrderComparator'

/**
 * Filter that takes an array of PreviousWorkExperienceDto objects and returns an array sorted in screen display order.
 *
 * The UI screens display previous work experience in a specific order, which is not alphabetic. This filter can be
 * used to sort an array of [PreviousWorkExperienceDto] based on [TypeOfWorkExperienceValue] so that they are in screen
 * order.
 *
 * This function is non-destructive. It returns a new array, and does not mutate the original array.
 */
const previousWorkExperienceObjectsSortedInScreenOrderFilter = (
  unsortedArray: Array<PreviousWorkExperienceDto>,
): Array<object> => {
  return [...unsortedArray].sort((left: PreviousWorkExperienceDto, right: PreviousWorkExperienceDto) =>
    previousWorkExperienceTypeScreenOrderComparator(left.experienceType, right.experienceType),
  )
}

export default previousWorkExperienceObjectsSortedInScreenOrderFilter
