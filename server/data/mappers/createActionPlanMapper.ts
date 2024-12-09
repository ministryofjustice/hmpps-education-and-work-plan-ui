import type { CreateActionPlanRequest } from 'educationAndWorkPlanApiClient'
import type { CreateActionPlanDto } from 'dto'
import { toCreateGoalRequest } from './createGoalMapper'

const toCreateActionPlanRequest = (dto: CreateActionPlanDto): CreateActionPlanRequest => ({
  goals: dto.goals.map(goal => toCreateGoalRequest(goal)),
})

export default toCreateActionPlanRequest
