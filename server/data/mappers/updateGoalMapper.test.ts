import type { UpdateGoalDto } from 'dto'
import type { UpdateGoalRequest, UpdateStepRequest } from 'educationAndWorkPlanApiClient'
import { toUpdateGoalRequest } from './updateGoalMapper'
import { aValidUpdateGoalDtoWithMultipleSteps } from '../../testsupport/updateGoalDtoTestDataBuilder'

describe('updateGoalMapper', () => {
  it('should map to UpdateGoalRequest given a valid DTO', () => {
    // Given
    const updateGoalDto: UpdateGoalDto = aValidUpdateGoalDtoWithMultipleSteps()
    const expectedUpdateStepRequest1: UpdateStepRequest = {
      stepReference: updateGoalDto.steps[0].stepReference,
      title: updateGoalDto.steps[0].title,
      status: updateGoalDto.steps[0].status,
      sequenceNumber: 1,
    }
    const expectedUpdateStepRequest2: UpdateStepRequest = {
      stepReference: updateGoalDto.steps[1].stepReference,
      title: updateGoalDto.steps[1].title,
      status: updateGoalDto.steps[1].status,
      sequenceNumber: 2,
    }
    const expectedCreateGoalRequest: UpdateGoalRequest = {
      goalReference: updateGoalDto.goalReference,
      title: updateGoalDto.title,
      steps: [expectedUpdateStepRequest1, expectedUpdateStepRequest2],
      notes: updateGoalDto.notes,
      targetCompletionDate: '2024-02-29',
      prisonId: updateGoalDto.prisonId,
    }

    // When
    const actual = toUpdateGoalRequest(updateGoalDto)

    // Then
    expect(actual).toEqual(expectedCreateGoalRequest)
  })
})
