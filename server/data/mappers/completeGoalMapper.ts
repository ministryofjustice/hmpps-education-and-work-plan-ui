import type { CompleteGoalDto } from 'dto'
import type { CompleteGoalRequest } from 'educationAndWorkPlanApiClient'

export default function toCompleteGoalRequest(dto: CompleteGoalDto): CompleteGoalRequest {
  return {
    goalReference: dto.goalReference,
    note: dto.note,
  }
}
