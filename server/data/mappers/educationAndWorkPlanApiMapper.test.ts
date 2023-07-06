import type { CreateGoalDto } from 'dto'
import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import aValidCreateGoalDtoWithOneStep from '../../testsupport/createGoalDtoTestDataBuilder'
import { toCreateGoalRequest } from './educationAndWorkPlanApiMapper'

describe('educationAndWorkPlanApiMapper', () => {
  it('should map to CreateGoalDto given valid form data', () => {
    // Given
    const createGoalDto: CreateGoalDto = aValidCreateGoalDtoWithOneStep()
    const expectedAddStepRequest: CreateStepRequest = {
      title: createGoalDto.steps[0].title,
      targetDate: createGoalDto.steps[0].targetDate,
      sequenceNumber: 1,
    }
    const expectedCreateGoalRequest: CreateGoalRequest = {
      prisonNumber: createGoalDto.prisonNumber,
      title: createGoalDto.title,
      category: 'WORK',
      reviewDate: createGoalDto.reviewDate,
      steps: [expectedAddStepRequest],
      note: createGoalDto.note,
    }

    // When
    const createGoalRequest = toCreateGoalRequest(createGoalDto)

    // Then
    expect(createGoalRequest).toEqual(expectedCreateGoalRequest)
  })
})
