import { format } from 'date-fns'
import type { UpdateGoalRequest, UpdateStepRequest } from 'educationAndWorkPlanApiClient'
import type { UpdateStepDto, UpdateGoalDto } from 'dto'

const toUpdateGoalRequest = (updateGoalDto: UpdateGoalDto): UpdateGoalRequest => {
  return {
    goalReference: updateGoalDto.goalReference,
    title: updateGoalDto.title,
    steps: updateGoalDto.steps.map(step => toUpdateStepRequest(step)),
    targetCompletionDate: format(updateGoalDto.targetCompletionDate, 'yyyy-MM-dd'),
    notes: updateGoalDto.notes,
    prisonId: updateGoalDto.prisonId,
  }
}

const toUpdateStepRequest = (updateStepDto: UpdateStepDto): UpdateStepRequest => {
  return {
    stepReference: updateStepDto.stepReference,
    status: updateStepDto.status,
    title: updateStepDto.title,
    sequenceNumber: updateStepDto.sequenceNumber,
  }
}

export { toUpdateGoalRequest, toUpdateStepRequest }
