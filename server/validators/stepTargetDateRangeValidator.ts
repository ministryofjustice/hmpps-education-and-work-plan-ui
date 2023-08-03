const TARGET_DATE_RANGES = [
  'ZERO_TO_THREE_MONTHS',
  'THREE_TO_SIX_MONTHS',
  'SIX_TO_TWELVE_MONTHS',
  'MORE_THAN_TWELVE_MONTHS',
]

export default function validateStepTargetDateRange(targetDateRange?: string): Array<string> {
  const errors: Array<string> = []

  if (!targetDateRange || targetDateRange.length < 1) {
    errors.push('Please select when they will achieve this by')
  } else if (!TARGET_DATE_RANGES.includes(targetDateRange)) {
    errors.push('Please select when they will achieve this by')
  }

  return errors
}
