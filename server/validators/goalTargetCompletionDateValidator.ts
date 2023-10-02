import moment from 'moment'

export default function goalTargetCompletionDateValidator(
  targetCompletionDate?: string,
  day?: string,
  month?: string,
  year?: string,
): Array<string> {
  const errors: Array<string> = []

  if (!targetCompletionDate) {
    errors.push('Select a target completion date')
    return errors
  }

  const proposedDate =
    targetCompletionDate === 'another-date'
      ? moment(`${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`, 'YYYY-MM-DD')
      : moment(targetCompletionDate, 'YYYY-MM-DD')

  if (!proposedDate.isValid()) {
    errors.push('Enter a valid date')
  }

  const today = moment()
  if (proposedDate.isBefore(today)) {
    errors.push('Enter a date in the future')
  }

  return errors
}
