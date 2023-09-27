import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import type { AddStepDto, CreateGoalDto } from 'dto'

const toCreateGoalRequest = (createGoalDto: CreateGoalDto): CreateGoalRequest => {
  return {
    prisonNumber: createGoalDto.prisonNumber,
    title: createGoalDto.title,
    category: 'WORK',
    steps: toAddStepRequests(createGoalDto),
    targetCompletionDate: toDateString(createGoalDto.targetCompletionDate),
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
    sequenceNumber: addStepDto.sequenceNumber,
  }
}

const toDateString = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export { toCreateGoalRequest, toAddStepRequest }
