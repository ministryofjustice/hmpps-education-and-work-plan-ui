import { getYear, isBefore, isValid, parse, startOfToday } from 'date-fns'

export default function goalTargetCompletionDateValidator(manuallyEnteredTargetCompletionDate?: string): Array<string> {
  const errors: Array<string> = []

  if (!manuallyEnteredTargetCompletionDate) {
    errors.push('Enter a valid date for when they are aiming to achieve this goal by')
    return errors
  }

  const today = startOfToday()
  const proposedDate = parse(manuallyEnteredTargetCompletionDate, 'd/M/yyyy', today)
  if (!isValid(proposedDate) || getYear(proposedDate) < 1900) {
    errors.push('Enter a valid date for when they are aiming to achieve this goal by')
  } else if (isBefore(proposedDate, today)) {
    errors.push('Enter a valid date. Date must be in the future')
  }

  return errors
}
