import { isAfter, isValid, parse, startOfToday } from 'date-fns'
import type { WhoCompletedReviewForm } from 'reviewPlanForms'
import formatErrors from '../../errorFormatter'
import ReviewPlanCompletedByValue from '../../../enums/reviewPlanCompletedByValue'

const validateWhoCompletedReviewForm = (
  whoCompletedReviewForm: WhoCompletedReviewForm,
): Array<Record<string, string>> => {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('completedBy', validateCompletedBy(whoCompletedReviewForm)))
  errors.push(...formatErrors('completedByOther', validateCompletedByOther(whoCompletedReviewForm)))
  errors.push(...formatErrors('review-date', validateReviewDate(whoCompletedReviewForm)))

  return errors
}

const validateReviewDate = (whoCompletedReviewForm: WhoCompletedReviewForm): Array<string> => {
  const errors: Array<string> = []

  const day = whoCompletedReviewForm['reviewDate-day']
  const month = whoCompletedReviewForm['reviewDate-month']
  const year = whoCompletedReviewForm['reviewDate-year']

  if (!(isOneOrTwoDigits(day) && isOneOrTwoDigits(month) && isFourDigits(year))) {
    errors.push('Enter a valid date that the review was completed on')
    return errors
  }

  const today = startOfToday()
  const proposedDate = parse(`${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`, 'yyyy-MM-dd', today)
  if (!isValid(proposedDate)) {
    errors.push('Enter a valid date that the review was completed on')
  }
  if (isAfter(proposedDate, today)) {
    errors.push('Enter a valid date. Date cannot be in the future')
  }
  return errors
}

const validateCompletedByOther = (whoCompletedReviewForm: WhoCompletedReviewForm): Array<string> => {
  const errors: Array<string> = []

  const { completedBy, completedByOther } = whoCompletedReviewForm
  if (completedBy === ReviewPlanCompletedByValue.SOMEBODY_ELSE) {
    if (!completedByOther) {
      errors.push(`Enter the name of the person who completed the review`)
    } else if (completedByOther.length > 200) {
      errors.push(`The person who completed the review must be 200 characters or less`)
    }
  }

  return errors
}

const validateCompletedBy = (whoCompletedReviewForm: WhoCompletedReviewForm): Array<string> => {
  const errors: Array<string> = []

  const { completedBy } = whoCompletedReviewForm
  if (!completedBy || isInvalidOption(completedBy)) {
    errors.push(`Select who completed the review`)
  }

  return errors
}

/**
 * Return true if the specified value is not in the full set of `ReviewPlanCompletedByValue` enum values.
 */
const isInvalidOption = (completedBy: ReviewPlanCompletedByValue): boolean => {
  const allValidValues = Object.values(ReviewPlanCompletedByValue)
  return !allValidValues.includes(completedBy)
}

const isOneOrTwoDigits = (value: string): boolean => {
  return !Number.isNaN(Number(value)) && (value?.length === 1 || value?.length === 2)
}

const isFourDigits = (value: string): boolean => {
  return !Number.isNaN(Number(value)) && value?.length === 4
}

export default validateWhoCompletedReviewForm
