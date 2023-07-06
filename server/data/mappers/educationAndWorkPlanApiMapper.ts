import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import type { CreateGoalDto } from 'dto'

const toCreateGoalRequest = (createGoalDto: CreateGoalDto): CreateGoalRequest => {
  return {
    prisonNumber: createGoalDto.prisonNumber,
    title: createGoalDto.title,
    category: 'WORK',
    reviewDate: createGoalDto.reviewDate,
    steps: [toAddStepRequest(createGoalDto)],
    note: createGoalDto.note,
  }
}

const toAddStepRequest = (createGoalDto: CreateGoalDto): CreateStepRequest => {
  return {
    title: createGoalDto.steps[0].title,
    targetDate: createGoalDto.steps[0].targetDate,
    sequenceNumber: 1,
  }
}

export { toCreateGoalRequest, toAddStepRequest }
