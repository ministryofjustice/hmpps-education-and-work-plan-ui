import { startOfDay } from 'date-fns'
import type { UpdateStepDto, UpdateGoalDto } from 'dto'
import type { UpdateGoalForm, UpdateStepForm } from 'forms'

const toUpdateGoalDto = (updateGoalForm: UpdateGoalForm, prisonId: string): UpdateGoalDto => {
  return {
    goalReference: updateGoalForm.reference,
    title: updateGoalForm.title,
    steps: updateGoalForm.steps.map(step => toUpdateStepDto(step)),
    targetCompletionDate: toTargetCompletionDate(updateGoalForm),
    notes: updateGoalForm.note,
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
  if (updateGoalForm.targetCompletionDate === 'another-date') {
    const day = updateGoalForm['targetCompletionDate-day'].padStart(2, '0')
    const month = updateGoalForm['targetCompletionDate-month'].padStart(2, '0')
    const year = updateGoalForm['targetCompletionDate-year']
    return startOfDay(`${year}-${month}-${day}`)
  }
  return startOfDay(updateGoalForm.targetCompletionDate)
}

export { toUpdateGoalDto, toUpdateStepDto }
