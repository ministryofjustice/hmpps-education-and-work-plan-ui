import moment from 'moment'

export default function validateGoalReviewDate(reviewDate?: Date): Array<string> {
  const errors: Array<string> = []

  if (!reviewDate) {
    errors.push('Enter a review date for the goal')
  } else if (Number.isNaN(reviewDate.getTime())) {
    errors.push('Enter a review date in the correct format')
  } else if (reviewDate < moment().toDate()) {
    errors.push('Enter a review date in the future')
  }

  return errors
}
