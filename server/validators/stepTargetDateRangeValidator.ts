const MAX_TARGET_DATE_RANGE_LENGTH = 50

export default function validateStepTargetDateRange(targetDateRange?: string): Array<string> {
  const errors: Array<string> = []

  if (!targetDateRange) {
    errors.push('Select a target date range')
  } else if (targetDateRange.length < 1) {
    errors.push('Select a target date range')
  } else if (targetDateRange.length > MAX_TARGET_DATE_RANGE_LENGTH) {
    errors.push(`The target date range must be ${MAX_TARGET_DATE_RANGE_LENGTH} characters or less`)
  }

  return errors
}
