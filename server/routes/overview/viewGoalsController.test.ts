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

  let req: Request
  const res = {
    render: jest.fn(),
    locals: {
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

    res.locals.allGoalsForPrisoner.problemRetrievingData = false
    res.locals.allGoalsForPrisoner.goals = {
      ACTIVE: [inProgressGoal],
      ARCHIVED: [archivedGoal],
      COMPLETED: [completedGoal],
    }

    const expectedView = {
      prisonerSummary,
      inProgressGoals: [inProgressGoal],
      archivedGoals: [archivedGoal],
      completedGoals: [completedGoal],
      problemRetrievingData: false,
      tab: 'goals',
    }

    // When
    await controller.viewGoals(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/partials/goalsTab/goalsTabContents', expectedView)
  })
})
