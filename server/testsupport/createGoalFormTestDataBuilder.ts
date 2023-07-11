import type { CreateGoalForm } from 'forms'

export default function aValidCreateGoalForm(): CreateGoalForm {
  return {
    prisonNumber: 'A1234BC',
    title: 'Learn Spanish',
  }
}
