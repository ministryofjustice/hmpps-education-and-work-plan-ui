import moment from 'moment'

export default function validateStepTargetDate(targetDate?: Date): Array<string> {
  const errors: Array<string> = []

  if (!targetDate) {
    return errors
  }

  if (Number.isNaN(targetDate.getTime())) {
    errors.push('Enter a target date in the correct format')
  } else if (targetDate < moment().toDate()) {
    errors.push('Enter a target date in the future')
  }

  return errors
}
