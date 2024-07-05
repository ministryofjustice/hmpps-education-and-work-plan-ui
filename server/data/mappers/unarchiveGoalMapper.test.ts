import type { UnarchiveGoalDto } from 'dto'
import type { UnarchiveGoalRequest } from 'educationAndWorkPlanApiClient'
import toUnarchiveGoalRequest from './unarchiveGoalMapper'

describe('unarchiveGoalMapper', () => {
  it('should map from DTO to request object', () => {
    const prisonNumber = 'A1234BC'
    const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'
    const dto: UnarchiveGoalDto = { prisonNumber, goalReference }
    const expected: UnarchiveGoalRequest = { goalReference }

    const request = toUnarchiveGoalRequest(dto)

    expect(request).toStrictEqual(expected)
  })
})
