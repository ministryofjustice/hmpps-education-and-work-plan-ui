import { Request, Response } from 'express'
import type { Goals } from 'viewModels'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import { aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'
import GoalStatusValue from '../../enums/goalStatusValue'
import retrieveGoals from './retrieveGoals'

jest.mock('../../services/educationAndWorkPlanService')
describe('retrieveGoals', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const requestHandler = retrieveGoals(educationAndWorkPlanService)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const status = GoalStatusValue.ACTIVE

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      user: { username },
      params: { prisonNumber },
      query: { status },
    } as unknown as Request
    res = {
      locals: {},
    } as unknown as Response
  })

  it('should retrieve Goals and store on res.locals', async () => {
    // Given
    const goals: Goals = { goals: [aValidGoal()], problemRetrievingData: false }
    educationAndWorkPlanService.getGoalsByStatus.mockResolvedValue(goals)

    const expected = {
      problemRetrievingData: false,
      goals,
    }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.goals).toEqual(expected)
    expect(educationAndWorkPlanService.getGoalsByStatus).toHaveBeenCalledWith(
      prisonNumber,
      GoalStatusValue.ACTIVE,
      username,
    )
    expect(next).toHaveBeenCalled()
  })

  it('should handle retrieval of Goals given Education service returns an unexpected error', async () => {
    // Given
    const educationServiceError = {
      status: 500,
      data: {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      },
    }

    educationAndWorkPlanService.getGoalsByStatus.mockRejectedValue(educationServiceError)

    const expected = {
      problemRetrievingData: true,
      goals: undefined as Goals,
    }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.goals).toEqual(expected)
    expect(educationAndWorkPlanService.getGoalsByStatus).toHaveBeenCalledWith(
      prisonNumber,
      GoalStatusValue.ACTIVE,
      username,
    )
    expect(next).toHaveBeenCalled()
  })

  it('should handle retrieval of Goals given Education service returns Not Found', async () => {
    // Given
    const educationServiceError = {
      status: 404,
      data: {
        status: 404,
        userMessage: `Education not found for prisoner [${prisonNumber}]`,
        developerMessage: `Education not found for prisoner [${prisonNumber}]`,
      },
    }

    educationAndWorkPlanService.getGoalsByStatus.mockRejectedValue(educationServiceError)

    const expected = {
      problemRetrievingData: false,
      goals: undefined as Goals,
    }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.goals).toEqual(expected)
    expect(educationAndWorkPlanService.getGoalsByStatus).toHaveBeenCalledWith(
      prisonNumber,
      GoalStatusValue.ACTIVE,
      username,
    )
    expect(next).toHaveBeenCalled()
  })
})
