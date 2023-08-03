const STEP_STATUSES = ['NOT_STARTED', 'ACTIVE', 'COMPLETE']

export default function validateStepStatus(status?: string): Array<string> {
  const errors: Array<string> = []

  if (!status) {
    errors.push('Choose a status for the step')
  } else if (!STEP_STATUSES.includes(status)) {
    errors.push('Choose a status for the step')
  }

  return errors
}
