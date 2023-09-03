import type { AddStepDto, CreateGoalDto } from 'dto'
import type { AddNoteForm, AddStepForm, CreateGoalForm } from 'forms'

const toCreateGoalDto = (
  createGoalForm: CreateGoalForm,
  addStepForms: Array<AddStepForm>,
  addNoteForm: AddNoteForm,
  prisonId: string,
): CreateGoalDto => {
  return {
    prisonNumber: createGoalForm.prisonNumber,
    title: createGoalForm.title,
    steps: toAddStepDtos(addStepForms),
    note: addNoteForm.note,
    prisonId,
  }
}

const toAddStepDtos = (addStepForms: Array<AddStepForm>): Array<AddStepDto> => {
  return addStepForms.map(step => toAddStepDto(step))
}

const toAddStepDto = (addStepForm: AddStepForm): AddStepDto => {
  return {
    title: addStepForm.title,
    targetDateRange: addStepForm.targetDateRange,
    sequenceNumber: addStepForm.stepNumber,
  }
}

export { toCreateGoalDto, toAddStepDto }
