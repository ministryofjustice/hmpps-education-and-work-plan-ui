import type { UnarchiveGoalDto } from 'dto'
import type { UnarchiveGoalRequest } from 'educationAndWorkPlanApiClient'

export default function toUnarchiveGoalRequest(dto: UnarchiveGoalDto): UnarchiveGoalRequest {
  return {
    goalReference: dto.goalReference,
  }
}
