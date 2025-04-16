import type { UnarchiveGoalDto } from 'dto'
import type { UnarchiveGoalForm } from 'forms'

export default function toUnarchiveGoalDto(
  prisonNumber: string,
  prisonId: string,
  form: UnarchiveGoalForm,
): UnarchiveGoalDto {
  return {
    goalReference: form.reference,
    prisonNumber,
    prisonId,
  }
}
