import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import ViewGoalsController from './viewGoalsController'
import GoalStatusValue from '../../enums/goalStatusValue'

jest.mock('../../services/educationAndWorkPlanService')

describe('ViewGoalsController', () => {
  const controller = new ViewGoalsController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  let req: Request
  const res = {
    render: jest.fn(),
    locals: {
      goals: {
        goals: [
          { title: 'Goal 1', status: GoalStatusValue.ACTIVE },
          { title: 'Goal 2', status: GoalStatusValue.ARCHIVED },
          { title: 'Goal 3', status: GoalStatusValue.COMPLETED },
        ],
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
        username: 'a-dps-user',
      },
      params: { prisonNumber },
    } as unknown as Request
  })

  it('should get goals page and filter goals correctly by status', async () => {
    // Given
    const expectedView = {
      prisonerSummary,
      inProgressGoals: [{ title: 'Goal 1', status: GoalStatusValue.ACTIVE }],
      archivedGoals: [{ title: 'Goal 2', status: GoalStatusValue.ARCHIVED }],
      completedGoals: [{ title: 'Goal 3', status: GoalStatusValue.COMPLETED }],
      problemRetrievingData: false,
      tab: 'goals',
    }

    // When
    await controller.viewGoals(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/partials/goalsTab/goalsTabContents', expectedView)
  })
})
