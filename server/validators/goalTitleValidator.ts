const MAX_GOAL_TITLE_LENGTH = 512

export default function validateGoalTitle(title?: string): Array<string> {
  const errors: Array<string> = []

  if (!title) {
    errors.push('Enter the goal')
  } else if (title.length < 1) {
    errors.push('Enter the goal')
  } else if (title.length > MAX_GOAL_TITLE_LENGTH) {
    errors.push(`Goal must be ${MAX_GOAL_TITLE_LENGTH} characters or less`)
  }

  return errors
}
