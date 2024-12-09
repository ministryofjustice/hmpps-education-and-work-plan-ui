import type { CreateActionPlanRequest, CreateGoalRequest } from 'educationAndWorkPlanApiClient'
import { aValidCreateGoalRequestWithOneStep } from './createGoalRequestTestDataBuilder'

const aValidCreateActionPlanRequest = (options?: { goals?: Array<CreateGoalRequest> }): CreateActionPlanRequest => ({
  goals: options?.goals || [aValidCreateGoalRequestWithOneStep()],
})

export default aValidCreateActionPlanRequest
