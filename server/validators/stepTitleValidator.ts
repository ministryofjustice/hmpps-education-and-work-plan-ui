const MAX_STEP_TITLE_LENGTH = 512

export default function validateStepTitle(title?: string): Array<string> {
  const errors: Array<string> = []

  if (!title) {
    errors.push('Enter the step needed to work towards the goal')
  } else if (title.length > MAX_STEP_TITLE_LENGTH) {
    errors.push(`The step description must be ${MAX_STEP_TITLE_LENGTH} characters or less`)
  }

  return errors
}
