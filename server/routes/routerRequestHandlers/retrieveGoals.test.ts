import { Request, Response } from 'express'
import type { Goals } from 'viewModels'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import { aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'
import GoalStatusValue from '../../enums/goalStatusValue'
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

  it.each([GoalStatusValue.ACTIVE, GoalStatusValue.COMPLETED, GoalStatusValue.ARCHIVED])(
    'should retrieve %s Goals and store on res.locals',
    async goalStatus => {
      // Given
      const requestHandler = retrieveGoals(educationAndWorkPlanService, goalStatus)

      const goals: Goals = { goals: [aValidGoal()], problemRetrievingData: false }
      educationAndWorkPlanService.getGoalsByStatus.mockResolvedValue(goals)

      // When
      await requestHandler(req, res, next)

      // Then
      expect(res.locals.goals).toEqual(goals)
      expect(educationAndWorkPlanService.getGoalsByStatus).toHaveBeenCalledWith(prisonNumber, goalStatus, username)
      expect(next).toHaveBeenCalled()
    },
  )
})
