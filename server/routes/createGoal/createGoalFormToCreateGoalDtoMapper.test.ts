import type { AddStepDto, CreateGoalDto } from 'dto'
import CreateGoalFormToCreateGoalDtoMapper from './createGoalFormToCreateGoalDtoMapper'
import aValidCreateGoalForm from '../../testsupport/createGoalFormTestDataBuilder'
import aValidAddStepFormWithOneStep from '../../testsupport/addStepFormTestDataBuilder'
import aValidAddNoteForm from '../../testsupport/addNoteFormTestDataBuilder'

describe('createGoalFormToCreateGoalDtoMapper', () => {
  it('should map to CreateGoalDto given valid form data', () => {
    // Given
    const createGoalDtoMapper = new CreateGoalFormToCreateGoalDtoMapper()
    const createGoalForm = aValidCreateGoalForm()
    const addStepForm = aValidAddStepFormWithOneStep()
    const addNoteForm = aValidAddNoteForm()

    const expectedAddStepDto: AddStepDto = {
      title: addStepForm.title,
      targetDate: addStepForm.targetDate,
    }
    const expectedCreateGoalDto: CreateGoalDto = {
      prisonNumber: createGoalForm.prisonNumber,
      title: createGoalForm.title,
      reviewDate: createGoalForm.reviewDate,
      steps: [expectedAddStepDto],
      note: addNoteForm.note,
    }

    // When
    const createGoalDto = createGoalDtoMapper.toCreateGoalDto(createGoalForm, addStepForm, addNoteForm)

    // Then
    expect(createGoalDto).toEqual(expectedCreateGoalDto)
  })
})
