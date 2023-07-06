import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import type { AddStepDto, CreateGoalDto } from 'dto'

const toCreateGoalRequest = (createGoalDto: CreateGoalDto): CreateGoalRequest => {
  return {
    prisonNumber: createGoalDto.prisonNumber,
    title: createGoalDto.title,
    category: 'WORK',
    reviewDate: createGoalDto.reviewDate,
    steps: toAddStepRequests(createGoalDto),
    note: createGoalDto.note,
  }
}

const toAddStepRequests = (createGoalDto: CreateGoalDto): Array<CreateStepRequest> => {
  return createGoalDto.steps.map(step => toAddStepRequest(step))
}

const toAddStepRequest = (addStepDto: AddStepDto): CreateStepRequest => {
  return {
    title: addStepDto.title,
    targetDate: addStepDto.targetDate,
    sequenceNumber: addStepDto.sequenceNumber,
  }
}

export { toCreateGoalRequest, toAddStepRequest }
