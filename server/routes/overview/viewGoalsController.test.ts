import { Request, Response } from 'express'
import type { PrisonerGoals } from 'viewModels'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import ViewGoalsController from './viewGoalsController'
import GoalStatusValue from '../../enums/goalStatusValue'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import { aValidGoalResponse } from '../../testsupport/actionPlanResponseTestDataBuilder'

jest.mock('../../services/educationAndWorkPlanService')

describe('ViewGoalsController', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const controller = new ViewGoalsController(educationAndWorkPlanService)

  const prisonNumber = 'A1234GC'
  const username = 'a-dps-user'
  const token = 'a-user-token'
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
        username,
        token,
      },
      params: { prisonNumber },
    } as unknown as Request
  })

  it('should get goals page and filter goals correctly by status', async () => {
    // Given
    const inProgressGoal = { ...aValidGoalResponse(), status: GoalStatusValue.ACTIVE }
    const archivedGoal = { ...aValidGoalResponse(), status: GoalStatusValue.ARCHIVED }
    const completedGoal = { ...aValidGoalResponse(), status: GoalStatusValue.COMPLETED }

    const prisonerGoals: PrisonerGoals = {
      prisonNumber,
      goals: {
        ACTIVE: [inProgressGoal],
        ARCHIVED: [archivedGoal],
        COMPLETE: [completedGoal],
      },
      problemRetrievingData: false,
    }

    educationAndWorkPlanService.getAllGoalsForPrisoner.mockResolvedValue(prisonerGoals)

    const expectedView = {
      prisonerSummary,
      inProgressGoals: prisonerGoals.goals.ACTIVE,
      archivedGoals: prisonerGoals.goals.ARCHIVED,
      completedGoals: prisonerGoals.goals.COMPLETE,
      problemRetrievingData: prisonerGoals.problemRetrievingData,
      tab: 'goals',
    }

    // When
    await controller.viewGoals(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/partials/goalsTab/goalsTabContents', expectedView)
    expect(educationAndWorkPlanService.getAllGoalsForPrisoner).toHaveBeenCalledWith(prisonNumber, username)
  })
})
