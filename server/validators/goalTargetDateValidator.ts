export default function validateTargetDate(targetCompletionDate: string): Array<string> {
  const errors: Array<string> = []

  if (!targetCompletionDate) {
    errors.push('Select when they are aiming to achieve this by')
  }

  return errors
}
