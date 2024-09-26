import { Request, Response } from 'express'
import type { PrisonerGoals } from 'viewModels'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import GoalStatusValue from '../../enums/goalStatusValue'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import retrieveAllGoalsForPrisoner from './retrieveAllGoalsForPrisoner'
import { aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'

jest.mock('../../services/educationAndWorkPlanService')

describe('ViewGoalsController', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>

  const prisonNumber = 'A1234GC'
  const username = 'a-dps-user'
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
    req = {
      session: { prisonerSummary },
      user: { username },
      params: { prisonNumber },
    } as unknown as Request
  })

  it('should retrieve all prisoner goals and store on res.locals', async () => {
    // Given
    const requestHandler = retrieveAllGoalsForPrisoner(educationAndWorkPlanService)

    const goals: PrisonerGoals = {
      prisonNumber,
      goals: {
        ACTIVE: [aValidGoal()],
        ARCHIVED: [aValidGoal({ status: GoalStatusValue.ARCHIVED })],
        COMPLETED: [aValidGoal({ status: GoalStatusValue.COMPLETED })],
      },
      problemRetrievingData: false,
    }
    educationAndWorkPlanService.getAllGoalsForPrisoner.mockResolvedValue(goals)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.allGoalsForPrisoner).toEqual(goals)
    expect(res.locals.allGoalsForPrisoner.problemRetrievingData).toEqual(false)
    expect(educationAndWorkPlanService.getAllGoalsForPrisoner).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
  })
})
