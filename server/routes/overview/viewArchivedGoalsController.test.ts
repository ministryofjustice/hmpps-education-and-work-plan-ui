import { Request, Response } from 'express'
import type { Goals } from 'viewModels'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import { aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import GoalStatusValue from '../../enums/goalStatusValue'
import ViewArchivedGoalsController from './viewArchivedGoalsController'

jest.mock('../../services/educationAndWorkPlanService')

describe('viewArchivedGoalsController', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>

  const controller = new ViewArchivedGoalsController(educationAndWorkPlanService)

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  let req: Request
  const res = {
    render: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: { prisonerSummary },
      user: {
        username: 'a-dps-user',
        token: 'a-user-token',
      },
      params: { prisonNumber },
    } as unknown as Request
  })
  it('should get view archived goals page', async () => {
    // Given
    const goals: Goals = { goals: [aValidGoal()], problemRetrievingData: false }
    educationAndWorkPlanService.getGoalsByStatus.mockResolvedValue(goals)

    const expectedView = {
      prisonerSummary,
      goals,
    }

    // When
    await controller.viewArchivedGoals(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/viewArchivedGoals', expectedView)
    expect(educationAndWorkPlanService.getGoalsByStatus).toHaveBeenCalledWith(
      prisonNumber,
      GoalStatusValue.ARCHIVED,
      'a-user-token',
    )
  })
})
