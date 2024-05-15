import { isBefore, isValid, parse, startOfToday } from 'date-fns'

export default function goalTargetCompletionDateValidator(day?: string, month?: string, year?: string): Array<string> {
  const errors: Array<string> = []

  if (!(isOneOrTwoDigits(day) && isOneOrTwoDigits(month) && isFourDigits(year))) {
    errors.push('Enter a valid date for when they are aiming to achieve this goal by')
    return errors
  }

  const today = startOfToday()
  const proposedDate = parse(`${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`, 'yyyy-MM-dd', today)
  if (!isValid(proposedDate)) {
    errors.push('Enter a valid date for when they are aiming to achieve this goal by')
  }
  if (isBefore(proposedDate, today)) {
    errors.push('Enter a valid date. Date must be in the future')
  }

  return errors
}

const isOneOrTwoDigits = (value: string): boolean => {
  return !Number.isNaN(Number(value)) && (value?.length === 1 || value?.length === 2)
}

const isFourDigits = (value: string): boolean => {
  return !Number.isNaN(Number(value)) && value?.length === 4
}
