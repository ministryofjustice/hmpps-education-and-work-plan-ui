import type { AddStepDto, CreateGoalDto } from 'dto'
import type { AddNoteForm, AddStepForm, CreateGoalForm } from 'forms'

const toCreateGoalDto = (
  createGoalForm: CreateGoalForm,
  addStepForms: Array<AddStepForm>,
  addNoteForm: AddNoteForm,
): CreateGoalDto => {
  return {
    prisonNumber: createGoalForm.prisonNumber,
    title: createGoalForm.title,
    reviewDate: createGoalForm.reviewDate,
    steps: toAddStepDtos(addStepForms),
    note: addNoteForm.note,
  }
}

const toAddStepDtos = (addStepForms: Array<AddStepForm>): Array<AddStepDto> => {
  return addStepForms.map(step => toAddStepDto(step))
}

const toAddStepDto = (addStepForm: AddStepForm): AddStepDto => {
  return {
    title: addStepForm.title,
    targetDate: addStepForm.targetDate,
    sequenceNumber: addStepForm.stepNumber,
  }
}

export { toCreateGoalDto, toAddStepDto }
