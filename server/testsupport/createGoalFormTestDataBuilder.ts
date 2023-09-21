import type { CreateGoalForm } from 'forms'

export default function aValidCreateGoalForm(title = 'Learn Spanish'): CreateGoalForm {
  return {
    prisonNumber: 'A1234BC',
    title,
  }
}
