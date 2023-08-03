const GOAL_STATUSES = ['ACTIVE', 'COMPLETED', 'ARCHIVED']

export default function validateGoalStatus(status?: string): Array<string> {
  const errors: Array<string> = []

  if (!status) {
    errors.push('Choose a status for the goal')
  } else if (!GOAL_STATUSES.includes(status)) {
    errors.push('Choose a status for the goal')
  }

  return errors
}
