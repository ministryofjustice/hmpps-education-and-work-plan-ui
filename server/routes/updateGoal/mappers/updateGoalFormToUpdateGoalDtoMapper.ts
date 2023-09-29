import moment from 'moment'
import type { UpdateStepDto, UpdateGoalDto } from 'dto'
import type { UpdateGoalForm, UpdateStepForm } from 'forms'

const toUpdateGoalDto = (updateGoalForm: UpdateGoalForm, prisonId: string): UpdateGoalDto => {
  return {
    goalReference: updateGoalForm.reference,
    title: updateGoalForm.title,
    status: updateGoalForm.status,
    steps: updateGoalForm.steps.map(step => toUpdateStepDto(step)),
    targetCompletionDate: toTargetCompletionDate(updateGoalForm),
    notes: updateGoalForm.note,
    prisonId,
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
  if (updateGoalForm.targetCompletionDate) {
    if (updateGoalForm.targetCompletionDate === 'another-date') {
      const day = updateGoalForm['targetCompletionDate-day'].padStart(2, '0')
      const month = updateGoalForm['targetCompletionDate-month'].padStart(2, '0')
      const year = updateGoalForm['targetCompletionDate-year']
      return moment(`${year}-${month}-${day}`).toDate()
    }
    return moment(updateGoalForm.targetCompletionDate).toDate()
  }
  return null
}

export { toUpdateGoalDto, toUpdateStepDto }
