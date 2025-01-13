import { isAfter, isValid, parse, startOfToday } from 'date-fns'
import type { WhoCompletedReviewForm } from 'reviewPlanForms'
import formatErrors from '../../errorFormatter'
import SessionCompletedByValue from '../../../enums/sessionCompletedByValue'

const validateWhoCompletedReviewForm = (
  whoCompletedReviewForm: WhoCompletedReviewForm,
): Array<Record<string, string>> => {
  const errors: Array<Record<string, string>> = []
  const completedByOtherErrors = validateCompletedByOther(whoCompletedReviewForm)

  errors.push(...formatErrors('completedBy', validateCompletedBy(whoCompletedReviewForm)))
  completedByOtherErrors.forEach(error => errors.push(...formatErrors(error.field, [error.message])))
  errors.push(...formatErrors('review-date', validateReviewDate(whoCompletedReviewForm)))

  return errors
}

const validateReviewDate = (whoCompletedReviewForm: WhoCompletedReviewForm): Array<string> => {
  const errors: Array<string> = []

  const day = whoCompletedReviewForm['reviewDate-day']
  const month = whoCompletedReviewForm['reviewDate-month']
  const year = whoCompletedReviewForm['reviewDate-year']

  if (!(isOneOrTwoDigits(day) && isOneOrTwoDigits(month) && isFourDigits(year))) {
    errors.push('Enter a valid date')
    return errors
  }

  const today = startOfToday()
  const proposedDate = parse(`${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`, 'yyyy-MM-dd', today)
  if (!isValid(proposedDate)) {
    errors.push('Enter a valid date')
  }
  if (isAfter(proposedDate, today)) {
    errors.push('Enter a valid date. Date cannot be in the future')
  }
  return errors
}

const validateCompletedByOther = (
  whoCompletedReviewForm: WhoCompletedReviewForm,
): Array<{ field: string; message: string }> => {
  const errors: Array<{ field: string; message: string }> = []
  const { completedBy, completedByOtherFullName, completedByOtherJobRole } = whoCompletedReviewForm

  if (completedBy === SessionCompletedByValue.SOMEBODY_ELSE) {
    if (!completedByOtherFullName) {
      errors.push({
        field: 'completedByOtherFullName',
        message: 'Enter the full name of the person who completed the review',
      })
    } else if (completedByOtherFullName.length > 200) {
      errors.push({ field: 'completedByOtherFullName', message: 'Full name must be 200 characters or less' })
    }

    if (!completedByOtherJobRole) {
      errors.push({
        field: 'completedByOtherJobRole',
        message: 'Enter the job title of the person who completed the review',
      })
    } else if (completedByOtherJobRole.length > 200) {
      errors.push({ field: 'completedByOtherJobRole', message: 'Job role must be 200 characters or less' })
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
const isInvalidOption = (completedBy: SessionCompletedByValue): boolean => {
  const allValidValues = Object.values(SessionCompletedByValue)
  return !allValidValues.includes(completedBy)
}

const isOneOrTwoDigits = (value: string): boolean => {
  return !Number.isNaN(Number(value)) && (value?.length === 1 || value?.length === 2)
}

const isFourDigits = (value: string): boolean => {
  return !Number.isNaN(Number(value)) && value?.length === 4
}

export default validateWhoCompletedReviewForm
