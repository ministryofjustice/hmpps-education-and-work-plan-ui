import { textValueExceedsLength } from './textValueValidator'

const MAX_GOAL_TITLE_LENGTH = 512

export default function validateGoalTitle(title?: string): Array<string> {
  const errors: Array<string> = []

  if (!title) {
    errors.push('Enter the goal description')
  } else if (textValueExceedsLength(title, MAX_GOAL_TITLE_LENGTH)) {
    errors.push(`The goal description must be ${MAX_GOAL_TITLE_LENGTH} characters or less`)
  }

  return errors
}
