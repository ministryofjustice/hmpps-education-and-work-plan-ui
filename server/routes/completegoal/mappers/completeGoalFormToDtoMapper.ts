import type { CompleteGoalDto } from 'dto'
import type { CompleteGoalForm } from 'forms'

export default function toCompleteGoalDto(
  prisonNumber: string,
  prisonId: string,
  form: CompleteGoalForm,
): CompleteGoalDto {
  return {
    goalReference: form.reference,
    prisonNumber,
    note: form.notes,
    prisonId,
  }
}
