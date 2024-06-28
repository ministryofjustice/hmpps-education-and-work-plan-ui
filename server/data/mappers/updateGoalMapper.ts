import type { UpdateGoalRequest, UpdateStepRequest } from 'educationAndWorkPlanApiClient'
import type { UpdateStepDto, UpdateGoalDto } from 'dto'

const toUpdateGoalRequest = (updateGoalDto: UpdateGoalDto): UpdateGoalRequest => {
  return {
    goalReference: updateGoalDto.goalReference,
    title: updateGoalDto.title,
    steps: updateGoalDto.steps.map(step => toUpdateStepRequest(step)),
    targetCompletionDate: toDateString(updateGoalDto.targetCompletionDate),
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

const toDateString = (date: Date): string => {
  return date?.toISOString().split('T')[0]
}

export { toUpdateGoalRequest, toUpdateStepRequest }
