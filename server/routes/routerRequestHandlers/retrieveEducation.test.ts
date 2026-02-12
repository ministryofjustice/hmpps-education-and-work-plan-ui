import { Request, Response } from 'express'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import retrieveEducation from './retrieveEducation'
import aValidEducationDto from '../../testsupport/educationDtoTestDataBuilder'

jest.mock('../../services/educationAndWorkPlanService')

describe('retrieveEducation', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const requestHandler = retrieveEducation(educationAndWorkPlanService)

  const prisonNumber = 'A1234BC'
  const username = 'testUser'

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

  it('should retrieve Education and store on res.locals', async () => {
    // Given
    const educationDto = aValidEducationDto()
    educationAndWorkPlanService.getEducation.mockResolvedValue(educationDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.education.isFulfilled()).toEqual(true)
    expect(res.locals.education.value).toEqual(educationDto)
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
  })

  it('should handle retrieval of Education given Education service returns an unexpected error', async () => {
    // Given
    const educationServiceError = {
      status: 500,
      data: {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      },
    }
    educationAndWorkPlanService.getEducation.mockRejectedValue(educationServiceError)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.education.isFulfilled()).toEqual(false)
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
  })

  it('should handle retrieval of Education given Education service returns null indicating Not Found', async () => {
    // Given
    educationAndWorkPlanService.getEducation.mockResolvedValue(null)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.education.isFulfilled()).toEqual(true)
    expect(res.locals.education.value).toBeNull()
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
  })
})
