import { parse, startOfDay, startOfToday } from 'date-fns'
import type { UpdateStepDto, UpdateGoalDto } from 'dto'
import type { UpdateGoalForm, UpdateStepForm } from 'forms'

const toUpdateGoalDto = (updateGoalForm: UpdateGoalForm, prisonId: string): UpdateGoalDto => {
  return {
    goalReference: updateGoalForm.reference,
    title: updateGoalForm.title,
    steps: updateGoalForm.steps.map(step => toUpdateStepDto(step)),
    targetCompletionDate: toTargetCompletionDate(updateGoalForm),
    notes: updateGoalForm.note?.trim() || null,
    prisonId,
    status: updateGoalForm.status,
  }
}

const toUpdateStepDto = (updateStepForm: UpdateStepForm): UpdateStepDto => {
  return {
    stepReference: updateStepForm.reference,
    status: updateStepForm.status,
    title: updateStepForm.title,
    sequenceNumber: updateStepForm.stepNumber,
  }
}

const toTargetCompletionDate = (updateGoalForm: UpdateGoalForm): Date => {
  const today = startOfToday()
  if (updateGoalForm.targetCompletionDate === 'another-date') {
    return startOfDay(parse(updateGoalForm.manuallyEnteredTargetCompletionDate, 'd/M/yyyy', today))
  }
  return startOfDay(parse(updateGoalForm.targetCompletionDate, 'd/M/yyyy', today))
}

export { toUpdateGoalDto, toUpdateStepDto }
