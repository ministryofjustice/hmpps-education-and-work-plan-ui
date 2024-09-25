import { Request, Response } from 'express'
import type { Goals } from 'viewModels'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import { aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'
import retrieveGoals from './retrieveGoals'

jest.mock('../../services/educationAndWorkPlanService')
describe('retrieveGoals', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      user: { username },
      params: { prisonNumber },
    } as unknown as Request
    res = {
      locals: {},
    } as unknown as Response
  })

  it('should retrieve all goals and store them on res.locals', async () => {
    // Given
    const requestHandler = retrieveGoals(educationAndWorkPlanService)

    const goals: Goals = { goals: [aValidGoal()], problemRetrievingData: false }
    educationAndWorkPlanService.getGoals.mockResolvedValue(goals)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.goals).toEqual(goals)
    expect(educationAndWorkPlanService.getGoals).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
  })
})
