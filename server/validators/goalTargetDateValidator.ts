export default function validateTargetDate(targetCompletionDate: string): Array<string> {
  const errors: Array<string> = []

  if (!targetCompletionDate) {
    errors.push('Select a target completion date')
  }

  return errors
}
