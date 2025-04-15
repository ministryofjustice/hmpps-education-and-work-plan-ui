import type { ArchiveGoalDto } from 'dto'
import type { ArchiveGoalForm } from 'forms'

export default function toArchiveGoalDto(
  prisonNumber: string,
  prisonId: string,
  form: ArchiveGoalForm,
): ArchiveGoalDto {
  return {
    goalReference: form.reference,
    prisonNumber,
    reason: form.reason,
    reasonOther: form.reasonOther,
    notes: form.notes,
    prisonId,
  }
}
