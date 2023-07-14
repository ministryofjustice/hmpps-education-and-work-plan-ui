export default function validateStepTargetDateRange(targetDateRange?: string): Array<string> {
  const errors: Array<string> = []

  if (!targetDateRange || targetDateRange.length < 1) {
    errors.push('Please select when they will achieve this by')
  }

  return errors
}
