import { Request, Response } from 'express'
import createError from 'http-errors'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import { aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'
import retrieveGoal from './retrieveGoal'

jest.mock('../../services/educationAndWorkPlanService')

describe('retrieveGoal', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const requestHandler = retrieveGoal(educationAndWorkPlanService)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const goalReference = '6be666f3-6325-4d91-9308-8eb7b9460c6d'

  const apiErrorCallback = jest.fn()
  const req = {
    user: { username },
    params: { prisonNumber, goalReference },
  } as unknown as Request
  const res = {
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals = { apiErrorCallback }
  })

  it('should retrieve Goal and store on res.locals', async () => {
    // Given
    const goal = aValidGoal()
    educationAndWorkPlanService.getPrisonerGoalByReference.mockResolvedValue(goal)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.goal.isFulfilled()).toEqual(true)
    expect(res.locals.goal.getOrNull()).toEqual(goal)
    expect(educationAndWorkPlanService.getPrisonerGoalByReference).toHaveBeenCalledWith(
      prisonNumber,
      goalReference,
      username,
    )
    expect(next).toHaveBeenCalledWith()
  })

  it('should store null on res.locals and call next with 404 error given goal does not exist', async () => {
    // Given
    educationAndWorkPlanService.getPrisonerGoalByReference.mockResolvedValue(null)

    const expectedError = createError(404, `Goal [${goalReference}] does not exist in [${prisonNumber}]'s plan`)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.goal).toBeUndefined()
    expect(educationAndWorkPlanService.getPrisonerGoalByReference).toHaveBeenCalledWith(
      prisonNumber,
      goalReference,
      username,
    )
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should store un-fulfilled promise on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('Error retrieving goal')
    educationAndWorkPlanService.getPrisonerGoalByReference.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.goal.isFulfilled()).toEqual(false)
    expect(educationAndWorkPlanService.getPrisonerGoalByReference).toHaveBeenCalledWith(
      prisonNumber,
      goalReference,
      username,
    )
    expect(next).toHaveBeenCalledWith()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
