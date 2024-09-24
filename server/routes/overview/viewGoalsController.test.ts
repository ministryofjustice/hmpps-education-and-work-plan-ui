import { Request, Response } from 'express'
import type { Goals } from 'viewModels'
import { aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'
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

  it('should render in progress goals with correct data', async () => {
    // Given
    const goals: Goals = { goals: [aValidGoal()], problemRetrievingData: false }
    res.locals = {
      goals: goals.goals,
      inProgressGoalsCount: 1,
      archivedGoalsCount: 0,
    }

    const expectedView = {
      prisonNumber,
      prisonerSummary,
      inProgressGoalsCount: 1,
      archivedGoalsCount: 0,
      goals: goals.goals,
      activeTab: 'in-progress',
      tab: 'goals',
    }

    // When
    await controller.viewInProgressGoals(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/viewInProgressGoals', expectedView)
  })

  it('should render archived goals with correct data', async () => {
    // Given
    const goals: Goals = { goals: [aValidGoal({ status: GoalStatusValue.ARCHIVED })], problemRetrievingData: false }
    res.locals = {
      goals: goals.goals,
      inProgressGoalsCount: 0,
      archivedGoalsCount: 1,
    }

    const expectedView = {
      prisonNumber,
      prisonerSummary,
      inProgressGoalsCount: 0,
      archivedGoalsCount: 1,
      goals: goals.goals,
      activeTab: 'archived',
      tab: 'goals',
    }

    // When
    await controller.viewArchivedGoals(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/viewArchivedGoalsV2', expectedView)
  })

  it('should call next with error if viewInProgressGoals throws an error', async () => {
    // Given
    const error = new Error('Test error')
    res.render = jest.fn(() => {
      throw error
    })

    // When
    await controller.viewInProgressGoals(req, res, next)

    // Then
    expect(next).toHaveBeenCalledWith(error)
  })

  it('should call next with error if viewArchivedGoals throws an error', async () => {
    // Given
    const error = new Error('Test error')
    res.render = jest.fn(() => {
      throw error
    })

    // When
    await controller.viewArchivedGoals(req, res, next)

    // Then
    expect(next).toHaveBeenCalledWith(error)
  })
})
