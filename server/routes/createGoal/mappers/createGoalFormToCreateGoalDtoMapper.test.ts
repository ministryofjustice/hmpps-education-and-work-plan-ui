import moment from 'moment'
import type { AddStepDto, CreateGoalDto } from 'dto'
import { anotherValidAddStepForm, aValidAddStepForm } from '../../../testsupport/addStepFormTestDataBuilder'
import { toCreateGoalDto } from './createGoalFormToCreateGoalDtoMapper'
import {
  aValidCreateGoalForm,
  aValidCreateGoalFormWithIndividualTargetDateFields,
  aValidCreateGoalFormDuringDaylightSavingTime,
} from '../../../testsupport/createGoalFormTestDataBuilder'
import aValidAddNoteForm from '../../../testsupport/addNoteFormTestDataBuilder'

describe('createGoalFormToCreateGoalDtoMapper', () => {
  it('should map to CreateGoalDto given multiple steps', () => {
    // Given
    const createGoalForm = aValidCreateGoalForm()
    const addStepForms = [aValidAddStepForm(), anotherValidAddStepForm()]
    const addNoteForm = aValidAddNoteForm()
    const prisonId = 'BXI'

    const expectedAddStepDto1: AddStepDto = {
      title: addStepForms[0].title,
      sequenceNumber: addStepForms[0].stepNumber,
    }
    const expectedAddStepDto2: AddStepDto = {
      title: addStepForms[1].title,
      sequenceNumber: addStepForms[1].stepNumber,
    }
    const expectedCreateGoalDto: CreateGoalDto = {
      prisonNumber: createGoalForm.prisonNumber,
      title: createGoalForm.title,
      steps: [expectedAddStepDto1, expectedAddStepDto2],
      note: addNoteForm.note,
      prisonId,
      targetCompletionDate: moment.utc('2024-02-29').toDate(),
    }

    // When
    const createGoalDto = toCreateGoalDto(createGoalForm, addStepForms, addNoteForm, prisonId)

    // Then
    expect(createGoalDto).toEqual(expectedCreateGoalDto)
  })

  it('should map to CreateGoalDto given individual target completion date fields', () => {
    // Given
    const createGoalForm = aValidCreateGoalFormWithIndividualTargetDateFields()
    const addStepForms = [aValidAddStepForm()]
    const addNoteForm = aValidAddNoteForm()
    const prisonId = 'BXI'

    const expectedAddStepDto: AddStepDto = {
      title: addStepForms[0].title,
      sequenceNumber: addStepForms[0].stepNumber,
    }
    const expectedCreateGoalDto: CreateGoalDto = {
      prisonNumber: createGoalForm.prisonNumber,
      title: createGoalForm.title,
      steps: [expectedAddStepDto],
      note: addNoteForm.note,
      prisonId,
      targetCompletionDate: moment.utc('2024-02-29').toDate(),
    }

    // When
    const createGoalDto = toCreateGoalDto(createGoalForm, addStepForms, addNoteForm, prisonId)

    // Then
    expect(createGoalDto).toEqual(expectedCreateGoalDto)
  })

  it('should map to CreateGoalDto given date during daylight saving time', () => {
    // Given
    const createGoalForm = aValidCreateGoalFormDuringDaylightSavingTime()
    const addStepForms = [aValidAddStepForm()]
    const addNoteForm = aValidAddNoteForm()
    const prisonId = 'BXI'

    const expectedAddStepDto: AddStepDto = {
      title: addStepForms[0].title,
      sequenceNumber: addStepForms[0].stepNumber,
    }
    const expectedCreateGoalDto: CreateGoalDto = {
      prisonNumber: createGoalForm.prisonNumber,
      title: createGoalForm.title,
      steps: [expectedAddStepDto],
      note: addNoteForm.note,
      prisonId,
      targetCompletionDate: moment.utc('2024-06-29').toDate(),
    }

    // When
    const createGoalDto = toCreateGoalDto(createGoalForm, addStepForms, addNoteForm, prisonId)

    // Then
    expect(createGoalDto).toEqual(expectedCreateGoalDto)
  })
})
