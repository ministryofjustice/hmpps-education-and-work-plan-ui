import { Request, Response } from 'express'
import type { ActionPlan } from 'viewModels'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import GoalStatusValue from '../../enums/goalStatusValue'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import retrieveActionPlan from './retrieveActionPlan'
import { aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'

jest.mock('../../services/educationAndWorkPlanService')

describe('retrieveActionPlan', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>

  const prisonNumber = 'A1234GC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    req = {
      session: { prisonerSummary },
      user: { username },
      params: { prisonNumber },
    } as unknown as Request
    res = {
      render: jest.fn(),
      locals: {},
    } as unknown as Response
    jest.resetAllMocks()
  })

  it('should retrieve all prisoner goals and store on res.locals', async () => {
    // Given
    const requestHandler = retrieveActionPlan(educationAndWorkPlanService)

    const expectedActionPlan: ActionPlan = {
      prisonNumber,
      goals: [
        aValidGoal(),
        aValidGoal({ status: GoalStatusValue.ARCHIVED }),
        aValidGoal({ status: GoalStatusValue.COMPLETED }),
      ],
      problemRetrievingData: false,
    }
    educationAndWorkPlanService.getActionPlan.mockResolvedValue(expectedActionPlan)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.actionPlan).toEqual(expectedActionPlan)
    expect(educationAndWorkPlanService.getActionPlan).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
  })
})
