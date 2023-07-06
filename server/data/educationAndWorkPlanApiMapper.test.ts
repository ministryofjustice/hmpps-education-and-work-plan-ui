import type { CreateGoalDto } from 'dto'
import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import EducationAndWorkPlanApiMapper from './educationAndWorkPlanApiMapper'
import aValidCreateGoalDtoWithOneStep from '../testsupport/createGoalDtoTestDataBuilder'

describe('educationAndWorkPlanApiMapper', () => {
  it('should map to CreateGoalDto given valid form data', () => {
    // Given
    const educationAndWorkPlanApiMapper = new EducationAndWorkPlanApiMapper()
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
    const createGoalRequest = educationAndWorkPlanApiMapper.toCreateGoalRequest(createGoalDto)

    // Then
    expect(createGoalRequest).toEqual(expectedCreateGoalRequest)
  })
})
