import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import ViewGoalsController from './viewGoalsController'
import GoalStatusValue from '../../enums/goalStatusValue'
import { aValidGoalResponse } from '../../testsupport/actionPlanResponseTestDataBuilder'

jest.mock('../../services/educationAndWorkPlanService')

describe('ViewGoalsController', () => {
  const controller = new ViewGoalsController()

  const prisonNumber = 'A1234GC'
  const username = 'a-dps-user'
  const token = 'a-user-token'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  const req = {
    user: {
      username,
      token,
    },
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {
      prisonerSummary,
      allGoalsForPrisoner: {
        goals: {
          ACTIVE: [],
          ARCHIVED: [],
          COMPLETED: [],
        },
        problemRetrievingData: false,
      },
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should get goals page and filter goals correctly by status', async () => {
    // Given
    const inProgressGoal = { ...aValidGoalResponse(), status: GoalStatusValue.ACTIVE }

    res.locals.allGoalsForPrisoner.problemRetrievingData = false
    res.locals.allGoalsForPrisoner.goals = {
      ACTIVE: [inProgressGoal],
    }

    const expectedView = {
      prisonerSummary,
      inProgressGoals: [inProgressGoal],
      problemRetrievingData: false,
      tab: 'goals',
      isInProgressGoalsTab: true,
      currentUrlPath: req.baseUrl + req.path,
    }

    // When
    await controller.viewInProgressGoals(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/partials/goalsTab/goalsTabContents', expectedView)
  })
})
