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
  const userToken = 'a-user-token'
  const inProgressGoal = aValidGoal()
  const archivedGoal = aValidGoal({ status: GoalStatusValue.ARCHIVED })

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      user: { username, token: userToken },
      params: { prisonNumber },
    } as unknown as Request
    res = {
      locals: {},
    } as unknown as Response
  })

  it.each([GoalStatusValue.ACTIVE, GoalStatusValue.ARCHIVED])(
    'should retrieve %s Goals and store on res.locals',
    async goalStatus => {
      // Given
      const requestHandler = retrieveGoals(educationAndWorkPlanService, goalStatus)

      const activeGoals: Goals = { goals: [inProgressGoal], problemRetrievingData: false }
      const archivedGoals: Goals = { goals: [archivedGoal], problemRetrievingData: false }

      educationAndWorkPlanService.getAllGoals.mockResolvedValueOnce({
        goals: [...activeGoals.goals, ...archivedGoals.goals],
        problemRetrievingData: false,
      })

      // When
      await requestHandler(req, res, next)

      // Then
      if (goalStatus === GoalStatusValue.ACTIVE) {
        expect(res.locals.goals).toEqual([inProgressGoal])
      } else if (goalStatus === GoalStatusValue.ARCHIVED) {
        expect(res.locals.goals).toEqual([archivedGoal])
      }

      expect(res.locals.inProgressGoalsCount).toBe(activeGoals.goals.length)
      expect(res.locals.archivedGoalsCount).toBe(archivedGoals.goals.length)
      expect(next).toHaveBeenCalled()
    },
  )

  it.each([GoalStatusValue.ACTIVE, GoalStatusValue.ARCHIVED])(
    'should retrieve goal counts while %s goals tab is active, and store on res.locals',
    async goalStatus => {
      // Given
      const requestHandler = retrieveGoals(educationAndWorkPlanService, goalStatus)

      const activeGoals: Goals = { goals: [inProgressGoal], problemRetrievingData: false }
      const archivedGoals: Goals = { goals: [archivedGoal], problemRetrievingData: false }

      educationAndWorkPlanService.getAllGoals.mockResolvedValueOnce({
        goals: [...activeGoals.goals, ...archivedGoals.goals],
        problemRetrievingData: false,
      })

      // When
      await requestHandler(req, res, next)

      // Then
      if (goalStatus === GoalStatusValue.ACTIVE) {
        expect(res.locals.goals).toEqual(activeGoals.goals)
      } else if (goalStatus === GoalStatusValue.ARCHIVED) {
        expect(res.locals.goals).toEqual(archivedGoals.goals)
      }

      expect(res.locals.inProgressGoalsCount).toBe(activeGoals.goals.length)
      expect(res.locals.archivedGoalsCount).toBe(archivedGoals.goals.length)
      expect(next).toHaveBeenCalled()
    },
  )
})
