import type { UnarchiveGoalDto } from 'dto'
import type { UnarchiveGoalRequest } from 'educationAndWorkPlanApiClient'
import toUnarchiveGoalRequest from './unarchiveGoalMapper'

describe('unarchiveGoalMapper', () => {
  it('should map from DTO to request object', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'
    const prisonId = 'BXI'

    const dto: UnarchiveGoalDto = { prisonNumber, goalReference, prisonId }
    const expected: UnarchiveGoalRequest = { goalReference, prisonId }

    // When
    const request = toUnarchiveGoalRequest(dto)

    // Then
    expect(request).toStrictEqual(expected)
  })
})
