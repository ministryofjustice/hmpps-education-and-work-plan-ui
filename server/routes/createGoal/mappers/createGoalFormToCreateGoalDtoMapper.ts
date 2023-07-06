import type { AddStepDto, CreateGoalDto } from 'dto'
import type { AddNoteForm, AddStepForm, CreateGoalForm } from 'forms'

const toCreateGoalDto = (
  createGoalForm: CreateGoalForm,
  addStepForm: AddStepForm,
  addNoteForm: AddNoteForm,
): CreateGoalDto => {
  return {
    prisonNumber: createGoalForm.prisonNumber,
    title: createGoalForm.title,
    reviewDate: createGoalForm.reviewDate,
    steps: [toAddStepDto(addStepForm)],
    note: addNoteForm.note,
  }
}

const toAddStepDto = (addStepForm: AddStepForm): AddStepDto => {
  return {
    title: addStepForm.title,
    targetDate: addStepForm.targetDate,
  }
}

export { toCreateGoalDto, toAddStepDto }
