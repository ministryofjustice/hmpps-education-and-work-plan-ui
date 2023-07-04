const MAX_STEP_TITLE_LENGTH = 512

export default function validateStepTitle(title?: string): Array<string> {
  const errors: Array<string> = []

  if (!title) {
    errors.push('Enter the step title')
  } else if (title.length < 1) {
    errors.push('Enter the step title')
  } else if (title.length > MAX_STEP_TITLE_LENGTH) {
    errors.push(`Step title must be ${MAX_STEP_TITLE_LENGTH} characters or less`)
  }

  return errors
}
