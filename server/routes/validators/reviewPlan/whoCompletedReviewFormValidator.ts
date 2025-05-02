import { getYear, isAfter, isValid, parse, startOfToday } from 'date-fns'
import type { WhoCompletedReviewForm } from 'reviewPlanForms'
import formatErrors from '../../errorFormatter'
import SessionCompletedByValue from '../../../enums/sessionCompletedByValue'
import { textValueExceedsLength } from '../../../validators/textValueValidator'

const validateWhoCompletedReviewForm = (
  whoCompletedReviewForm: WhoCompletedReviewForm,
): Array<Record<string, string>> => {
  const errors: Array<Record<string, string>> = []
  const completedByOtherErrors = validateCompletedByOther(whoCompletedReviewForm)

  errors.push(...formatErrors('completedBy', validateCompletedBy(whoCompletedReviewForm)))
  completedByOtherErrors.forEach(error => errors.push(...formatErrors(error.field, [error.message])))
  errors.push(...formatErrors('reviewDate', validateReviewDate(whoCompletedReviewForm)))

  return errors
}

const validateReviewDate = (whoCompletedReviewForm: WhoCompletedReviewForm): Array<string> => {
  const errors: Array<string> = []

  const { reviewDate } = whoCompletedReviewForm

  if (!reviewDate) {
    errors.push('Enter a valid date')
    return errors
  }

  const today = startOfToday()
  const proposedDate = parse(reviewDate, 'd/M/yyyy', today)
  if (!isValid(proposedDate) || getYear(proposedDate) < 1900) {
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
    } else if (textValueExceedsLength(completedByOtherFullName, 200)) {
      errors.push({ field: 'completedByOtherFullName', message: 'Full name must be 200 characters or less' })
    }

    if (!completedByOtherJobRole) {
      errors.push({
        field: 'completedByOtherJobRole',
        message: 'Enter the job title of the person who completed the review',
      })
    } else if (textValueExceedsLength(completedByOtherJobRole, 200)) {
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
 * Return true if the specified value is not in the full set of `SessionCompletedByValue` enum values.
 */
const isInvalidOption = (completedBy: SessionCompletedByValue): boolean => {
  const allValidValues = Object.values(SessionCompletedByValue)
  return !allValidValues.includes(completedBy)
}

export default validateWhoCompletedReviewForm
