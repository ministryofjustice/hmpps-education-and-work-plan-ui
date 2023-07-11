import type { AddStepDto, CreateGoalDto } from 'dto'
import { anotherValidAddStepForm, aValidAddStepForm } from '../../../testsupport/addStepFormTestDataBuilder'
import { toCreateGoalDto } from './createGoalFormToCreateGoalDtoMapper'
import aValidCreateGoalForm from '../../../testsupport/createGoalFormTestDataBuilder'
import aValidAddNoteForm from '../../../testsupport/addNoteFormTestDataBuilder'

describe('createGoalFormToCreateGoalDtoMapper', () => {
  it('should map to CreateGoalDto given multiple steps', () => {
    // Given
    const createGoalForm = aValidCreateGoalForm()
    const addStepForms = [aValidAddStepForm(), anotherValidAddStepForm()]
    const addNoteForm = aValidAddNoteForm()

    const expectedAddStepDto1: AddStepDto = {
      title: addStepForms[0].title,
      targetDateRange: addStepForms[0].targetDateRange,
      sequenceNumber: addStepForms[0].stepNumber,
    }
    const expectedAddStepDto2: AddStepDto = {
      title: addStepForms[1].title,
      targetDateRange: addStepForms[1].targetDateRange,
      sequenceNumber: addStepForms[1].stepNumber,
    }
    const expectedCreateGoalDto: CreateGoalDto = {
      prisonNumber: createGoalForm.prisonNumber,
      title: createGoalForm.title,
      steps: [expectedAddStepDto1, expectedAddStepDto2],
      note: addNoteForm.note,
    }

    // When
    const createGoalDto = toCreateGoalDto(createGoalForm, addStepForms, addNoteForm)

    // Then
    expect(createGoalDto).toEqual(expectedCreateGoalDto)
  })
})
