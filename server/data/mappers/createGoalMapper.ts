import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import type { AddStepDto, CreateGoalDto } from 'dto'

const toCreateGoalRequest = (createGoalDto: CreateGoalDto): CreateGoalRequest => {
  return {
    prisonNumber: createGoalDto.prisonNumber,
    title: createGoalDto.title,
    category: 'WORK',
    steps: toAddStepRequests(createGoalDto),
    notes: createGoalDto.note,
    prisonId: createGoalDto.prisonId,
  }
}

const toAddStepRequests = (createGoalDto: CreateGoalDto): Array<CreateStepRequest> => {
  return createGoalDto.steps.map(step => toAddStepRequest(step))
}

const toAddStepRequest = (addStepDto: AddStepDto): CreateStepRequest => {
  return {
    title: addStepDto.title,
    targetDateRange: addStepDto.targetDateRange,
    sequenceNumber: addStepDto.sequenceNumber,
  }
}

export { toCreateGoalRequest, toAddStepRequest }
