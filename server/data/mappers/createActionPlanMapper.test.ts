import { aValidCreateGoalDtoWithOneStep } from '../../testsupport/createGoalDtoTestDataBuilder'
import aValidCreateActionPlanDto from '../../testsupport/createActionPlanDtoTestDataBuilder'
import toCreateActionPlanRequest from './createActionPlanMapper'
import aValidCreateActionPlanRequest from '../../testsupport/createActionPlanRequestTestDataBuilder'
import { aValidCreateGoalRequestWithOneStep } from '../../testsupport/createGoalRequestTestDataBuilder'

describe('toCreateActionPlanRequest', () => {
  it('should map to CreateActionPlanRequest', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const createActionPlanDto = aValidCreateActionPlanDto({
      prisonNumber,
      goals: [aValidCreateGoalDtoWithOneStep()],
    })

    const expectedCreateActionPlanRequest = aValidCreateActionPlanRequest({
      goals: [aValidCreateGoalRequestWithOneStep()],
    })

    // When
    const actual = toCreateActionPlanRequest(createActionPlanDto)

    // Then
    expect(actual).toEqual(expectedCreateActionPlanRequest)
  })
})
