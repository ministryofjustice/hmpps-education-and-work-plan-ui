import type { UpdateGoalRequest, UpdateStepRequest } from 'educationAndWorkPlanApiClient'
import type { UpdateStepDto, UpdateGoalDto } from 'dto'

const toUpdateGoalRequest = (updateGoalDto: UpdateGoalDto): UpdateGoalRequest => {
  return {
    goalReference: updateGoalDto.goalReference,
    title: updateGoalDto.title,
    status: updateGoalDto.status,
    steps: updateGoalDto.steps.map(step => toUpdateStepRequest(step)),
    targetCompletionDate: updateGoalDto.targetCompletionDate,
    notes: updateGoalDto.notes,
    prisonId: updateGoalDto.prisonId,
  }
}

const toUpdateStepRequest = (updateStepDto: UpdateStepDto): UpdateStepRequest => {
  return {
    stepReference: updateStepDto.stepReference,
    status: updateStepDto.status,
    title: updateStepDto.title,
    targetDateRange: updateStepDto.targetDateRange,
    sequenceNumber: updateStepDto.sequenceNumber,
  }
}

export { toUpdateGoalRequest, toUpdateStepRequest }
