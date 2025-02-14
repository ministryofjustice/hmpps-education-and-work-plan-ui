import { Request, Response } from 'express'
import { startOfDay } from 'date-fns'
import type { PrisonerGoals } from 'viewModels'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import ViewGoalsController from './viewGoalsController'
import GoalStatusValue from '../../enums/goalStatusValue'
import { aValidGoalResponse } from '../../testsupport/actionPlanResponseTestDataBuilder'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'
import aValidInductionSchedule from '../../testsupport/inductionScheduleTestDataBuilder'
import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'

jest.mock('../../services/educationAndWorkPlanService')

describe('ViewGoalsController', () => {
  const controller = new ViewGoalsController()

  const prisonNumber = 'A1234GC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const induction = {
    problemRetrievingData: false,
    inductionDto: aValidInductionDto(),
  }
  const inductionSchedule = aValidInductionSchedule({ scheduleStatus: InductionScheduleStatusValue.COMPLETED })

  const allGoalsForPrisoner: PrisonerGoals = {
    prisonNumber,
    goals: {
      ACTIVE: [],
      ARCHIVED: [],
      COMPLETED: [],
    },
    problemRetrievingData: false,
  }

  const req = {
    user: { username },
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {
      prisonerSummary,
      allGoalsForPrisoner,
      induction,
      inductionSchedule,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
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
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'COMPLETE',
        inductionDueDate: startOfDay('2024-12-10'),
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
        reviewDueDate: undefined as Date,
        exemptionReason: undefined as string,
      },
    }

    // When
    await controller.viewGoals(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/partials/goalsTab/goalsTabContents', expectedView)
  })
})
