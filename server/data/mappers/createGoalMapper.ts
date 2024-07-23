import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import type { AddStepDto, CreateGoalDto } from 'dto'
import { format } from 'date-fns'

const toCreateGoalRequest = (createGoalDto: CreateGoalDto): CreateGoalRequest => {
  return {
    title: createGoalDto.title,
    steps: toAddStepRequests(createGoalDto),
    targetCompletionDate: format(createGoalDto.targetCompletionDate, 'yyyy-MM-dd'),
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

export { toCreateGoalRequest, toAddStepRequest }
