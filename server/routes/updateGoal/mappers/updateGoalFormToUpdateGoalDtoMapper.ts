import type { UpdateStepDto, UpdateGoalDto } from 'dto'
import type { UpdateGoalForm, UpdateStepForm } from 'forms'

const toUpdateGoalDto = (updateGoalForm: UpdateGoalForm, prisonId: string): UpdateGoalDto => {
  return {
    goalReference: updateGoalForm.reference,
    title: updateGoalForm.title,
    status: updateGoalForm.status,
    steps: updateGoalForm.steps.map(step => toUpdateStepDto(step)),
    reviewDate: updateGoalForm.reviewDate,
    notes: updateGoalForm.note,
    prisonId,
  }
}

const toUpdateStepDto = (updateStepForm: UpdateStepForm): UpdateStepDto => {
  return {
    stepReference: updateStepForm.reference,
    status: updateStepForm.status,
    title: updateStepForm.title,
    targetDateRange: updateStepForm.targetDateRange,
    sequenceNumber: updateStepForm.stepNumber,
  }
}

export { toUpdateGoalDto, toUpdateStepDto }
