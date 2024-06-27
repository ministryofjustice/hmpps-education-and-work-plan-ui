import type { ArchiveGoalDto } from 'dto'
import type { ArchiveGoalForm } from 'forms'

export default function toArchiveGoalDto(prisonNumber: string, form: ArchiveGoalForm): ArchiveGoalDto {
  return {
    goalReference: form.reference,
    prisonNumber,
    reason: form.reason,
    reasonOther: form.reasonOther,
  }
}
