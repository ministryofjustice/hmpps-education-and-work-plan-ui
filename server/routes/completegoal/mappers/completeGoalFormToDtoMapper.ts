import type { CompleteGoalDto } from 'dto'
import type { CompleteGoalForm } from 'forms'

export default function toCompleteGoalDto(prisonNumber: string, form: CompleteGoalForm): CompleteGoalDto {
  return {
    goalReference: form.reference,
    prisonNumber,
    note: form.note,
  }
}
