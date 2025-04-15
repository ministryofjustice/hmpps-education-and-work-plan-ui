import type { ArchiveGoalDto } from 'dto'
import type { ArchiveGoalRequest } from 'educationAndWorkPlanApiClient'

export default function toArchiveGoalRequest(dto: ArchiveGoalDto): ArchiveGoalRequest {
  return {
    goalReference: dto.goalReference,
    reason: dto.reason,
    reasonOther: dto.reasonOther,
    note: dto.notes,
    prisonId: dto.prisonId,
  }
}
