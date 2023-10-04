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

  let proposedDate: moment.Moment
  if (targetCompletionDate === 'another-date') {
    if (isNotNumeric(day) || isNotNumeric(month) || isNotNumeric(year)) {
      errors.push('Enter a valid date')
      return errors
    }
    proposedDate = moment(`${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`, 'YYYY-MM-DD')
  } else {
    proposedDate = moment(targetCompletionDate, 'YYYY-MM-DD')
  }

  if (!proposedDate.isValid()) {
    errors.push('Enter a valid date')
  }

  const today = moment()
  if (proposedDate.isBefore(today)) {
    errors.push('Enter a date in the future')
  }

  return errors
}

const isNotNumeric = (value: string): boolean => {
  return Number.isNaN(Number(value))
}
