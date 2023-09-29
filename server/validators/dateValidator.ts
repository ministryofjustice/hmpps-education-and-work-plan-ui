import moment from 'moment'

export default function validateDate(day: string, month: string, year: string): Array<string> {
  const errors: Array<string> = []

  if (!day || !month || !year) {
    errors.push('Enter a date')
  } else if (!moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').isValid()) {
    errors.push('Enter a valid date')
  } else if (moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').isBefore()) {
    errors.push('Enter a date in the future')
  }

  return errors
}
