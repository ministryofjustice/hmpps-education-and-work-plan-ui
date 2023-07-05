import type { AddStepDto, CreateGoalDto } from 'dto'
import type { AddNoteForm, AddStepForm, CreateGoalForm } from 'forms'

export default class CreateGoalFormToCreateGoalDtoMapper {
  toCreateGoalDto(
    prisonNumber: string,
    createGoalForm: CreateGoalForm,
    addStepForm: AddStepForm,
    addNoteForm: AddNoteForm,
  ): CreateGoalDto {
    const addStepDto = {
      title: addStepForm.title,
      targetDate: addStepForm.targetDate,
    } as AddStepDto

    const createGoalDto = {
      prisonNumber,
      title: createGoalForm.title,
      reviewDate: createGoalForm.reviewDate,
      steps: [addStepDto],
      note: addNoteForm.note,
    } as CreateGoalDto

    return createGoalDto
  }
}
