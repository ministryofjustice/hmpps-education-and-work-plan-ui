import type { AddStepDto, CreateGoalDto } from 'dto'
import type { AddNoteForm, AddStepForm, CreateGoalForm } from 'forms'
import moment from 'moment'

const toCreateGoalDto = (
  createGoalForm: CreateGoalForm,
  addStepForms: Array<AddStepForm>,
  addNoteForm: AddNoteForm,
  prisonId: string,
): CreateGoalDto => {
  return {
    prisonNumber: createGoalForm.prisonNumber,
    title: createGoalForm.title,
    targetCompletionDate: toTargetCompletionDate(createGoalForm),
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
    sequenceNumber: addStepForm.stepNumber,
  }
}

const toTargetCompletionDate = (createGoalForm: CreateGoalForm): Date => {
  if (createGoalForm.targetCompletionDate) {
    if (createGoalForm.targetCompletionDate === 'another-date') {
      const day = createGoalForm['targetCompletionDate-day'].padStart(2, '0')
      const month = createGoalForm['targetCompletionDate-month'].padStart(2, '0')
      const year = createGoalForm['targetCompletionDate-year']
      return moment.utc(`${year}-${month}-${day}`).toDate()
    }
    return moment.utc(createGoalForm.targetCompletionDate).toDate()
  }
  return null
}

export { toCreateGoalDto, toAddStepDto }
