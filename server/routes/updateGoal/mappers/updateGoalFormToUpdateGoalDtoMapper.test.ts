import type { UpdateStepDto, UpdateGoalDto } from 'dto'
import aValidUpdateGoalForm from '../../../testsupport/updateGoalFormTestDataBuilder'
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
      targetCompletionDate: updateGoalForm.targetCompletionDate,
      notes: updateGoalForm.note,
      prisonId,
    }

    // When
    const actual = toUpdateGoalDto(updateGoalForm, prisonId)

    // Then
    expect(actual).toEqual(expectedUpdateGoalDto)
  })
})
