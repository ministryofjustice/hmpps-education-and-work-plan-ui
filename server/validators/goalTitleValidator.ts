export default function validateGoalTitle(title?: string): Array<string> {
  const errors: Array<string> = []

  if (!title) {
    errors.push('Enter a title for the goal')
  } else if (title.length < 1) {
    errors.push('Enter a title for the goal')
  } else if (title.length > 512) {
    errors.push('Enter a title for the goal with less than 512 characters')
  }

  return errors
}
