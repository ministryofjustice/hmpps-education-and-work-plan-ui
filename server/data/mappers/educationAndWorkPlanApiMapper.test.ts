import type { CreateGoalDto } from 'dto'
import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import { toCreateGoalRequest } from './educationAndWorkPlanApiMapper'
import { aValidCreateGoalDtoWithMultipleSteps } from '../../testsupport/createGoalDtoTestDataBuilder'

describe('educationAndWorkPlanApiMapper', () => {
  it('should map to CreateGoalDto given valid form data', () => {
    // Given
    const createGoalDto: CreateGoalDto = aValidCreateGoalDtoWithMultipleSteps()
    const expectedAddStepRequest1: CreateStepRequest = {
      title: createGoalDto.steps[0].title,
      targetDate: createGoalDto.steps[0].targetDate,
      sequenceNumber: 1,
    }
    const expectedAddStepRequest2: CreateStepRequest = {
      title: createGoalDto.steps[1].title,
      targetDate: createGoalDto.steps[1].targetDate,
      sequenceNumber: 2,
    }
    const expectedCreateGoalRequest: CreateGoalRequest = {
      prisonNumber: createGoalDto.prisonNumber,
      title: createGoalDto.title,
      category: 'WORK',
      reviewDate: createGoalDto.reviewDate,
      steps: [expectedAddStepRequest1, expectedAddStepRequest2],
      notes: createGoalDto.note,
    }

    // When
    const createGoalRequest = toCreateGoalRequest(createGoalDto)

    // Then
    expect(createGoalRequest).toEqual(expectedCreateGoalRequest)
  })
})
