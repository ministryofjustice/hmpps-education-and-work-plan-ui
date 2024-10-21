import type { CompleteGoalForm } from 'forms'

export default function aValidCompleteGoalForm(
  reference = '95b18362-fe56-4234-9ad2-11ef98b974a3',
  title = 'Learn to cut hair',
  notes = 'A completion note',
): CompleteGoalForm {
  return {
    notes,
    reference,
    title,
  }
}
