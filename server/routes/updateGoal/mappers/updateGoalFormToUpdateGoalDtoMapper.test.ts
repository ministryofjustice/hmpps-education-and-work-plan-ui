import moment from 'moment'
import type { UpdateStepDto, UpdateGoalDto } from 'dto'
import {
  aValidUpdateGoalForm,
  aValidUpdateGoalFormWithIndividualTargetDateFields,
  aValidUpdateGoalFormDuringDaylightSavingTime,
} from '../../../testsupport/updateGoalFormTestDataBuilder'
import { toUpdateGoalDto } from './updateGoalFormToUpdateGoalDtoMapper'

describe('updateGoalFormToUpdateGoalDtoMapper', () => {
  it('should map UpdateGoalForm to UpdateGoalDto', () => {
    // Given
    const updateGoalForm = aValidUpdateGoalForm()
    const prisonId = 'MDI'

    const expectedUpdateStepDto1: UpdateStepDto = {
      stepReference: updateGoalForm.steps[0].reference,
      status: updateGoalForm.steps[0].status,
      title: updateGoalForm.steps[0].title,
      sequenceNumber: updateGoalForm.steps[0].stepNumber,
    }
    const expectedUpdateStepDto2: UpdateStepDto = {
      stepReference: updateGoalForm.steps[1].reference,
      status: updateGoalForm.steps[1].status,
      title: updateGoalForm.steps[1].title,
      sequenceNumber: updateGoalForm.steps[1].stepNumber,
    }
    const expectedUpdateGoalDto: UpdateGoalDto = {
      goalReference: updateGoalForm.reference,
      title: updateGoalForm.title,
      status: updateGoalForm.status,
      steps: [expectedUpdateStepDto1, expectedUpdateStepDto2],
      targetCompletionDate: moment.utc('2024-02-29').toDate(),
      notes: updateGoalForm.note,
      prisonId,
    }

    // When
    const actual = toUpdateGoalDto(updateGoalForm, prisonId)

    // Then
    expect(actual).toEqual(expectedUpdateGoalDto)
  })

  it('should map UpdateGoalForm to UpdateGoalDto given individual target completion date fields', () => {
    // Given
    const updateGoalForm = aValidUpdateGoalFormWithIndividualTargetDateFields()
    const prisonId = 'MDI'

    const expectedUpdateStepDto: UpdateStepDto = {
      stepReference: updateGoalForm.steps[0].reference,
      status: updateGoalForm.steps[0].status,
      title: updateGoalForm.steps[0].title,
      sequenceNumber: updateGoalForm.steps[0].stepNumber,
    }
    const expectedUpdateGoalDto: UpdateGoalDto = {
      goalReference: updateGoalForm.reference,
      title: updateGoalForm.title,
      status: updateGoalForm.status,
      steps: [expectedUpdateStepDto],
      targetCompletionDate: moment.utc('2024-02-29').toDate(),
      notes: updateGoalForm.note,
      prisonId,
    }

    // When
    const actual = toUpdateGoalDto(updateGoalForm, prisonId)

    // Then
    expect(actual).toEqual(expectedUpdateGoalDto)
  })

  it('should map UpdateGoalForm to UpdateGoalDto given date during daylight saving time', () => {
    // Given
    const updateGoalForm = aValidUpdateGoalFormDuringDaylightSavingTime()
    const prisonId = 'MDI'

    const expectedUpdateStepDto: UpdateStepDto = {
      stepReference: updateGoalForm.steps[0].reference,
      status: updateGoalForm.steps[0].status,
      title: updateGoalForm.steps[0].title,
      sequenceNumber: updateGoalForm.steps[0].stepNumber,
    }
    const expectedUpdateGoalDto: UpdateGoalDto = {
      goalReference: updateGoalForm.reference,
      title: updateGoalForm.title,
      status: updateGoalForm.status,
      steps: [expectedUpdateStepDto],
      targetCompletionDate: moment.utc('2024-06-29').toDate(),
      notes: updateGoalForm.note,
      prisonId,
    }

    // When
    const actual = toUpdateGoalDto(updateGoalForm, prisonId)

    // Then
    expect(actual).toEqual(expectedUpdateGoalDto)
  })
})
