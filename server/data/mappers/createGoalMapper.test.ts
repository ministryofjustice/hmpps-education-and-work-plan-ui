import type { CreateGoalDto } from 'dto'
import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import { toCreateGoalRequest } from './createGoalMapper'
import { aValidCreateGoalDtoWithMultipleSteps } from '../../testsupport/createGoalDtoTestDataBuilder'

describe('createGoalMapper', () => {
  it('should map to CreateGoalRequest given a valid DTO', () => {
    // Given
    const createGoalDto: CreateGoalDto = aValidCreateGoalDtoWithMultipleSteps()
    const expectedAddStepRequest1: CreateStepRequest = {
      title: createGoalDto.steps[0].title,
      targetDateRange: createGoalDto.steps[0].targetDateRange,
      sequenceNumber: 1,
    }
    const expectedAddStepRequest2: CreateStepRequest = {
      title: createGoalDto.steps[1].title,
      targetDateRange: createGoalDto.steps[1].targetDateRange,
      sequenceNumber: 2,
    }
    const expectedCreateGoalRequest: CreateGoalRequest = {
      prisonNumber: createGoalDto.prisonNumber,
      title: createGoalDto.title,
      category: 'WORK',
      steps: [expectedAddStepRequest1, expectedAddStepRequest2],
      notes: createGoalDto.note,
      prisonId: createGoalDto.prisonId,
    }

    // When
    const actual = toCreateGoalRequest(createGoalDto)

    // Then
    expect(actual).toEqual(expectedCreateGoalRequest)
  })
})
