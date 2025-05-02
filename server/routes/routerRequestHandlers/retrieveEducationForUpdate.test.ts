import { Request, Response } from 'express'
import createHttpError from 'http-errors'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import retrieveEducationForUpdate from './retrieveEducationForUpdate'
import aValidEducationDto from '../../testsupport/educationDtoTestDataBuilder'

jest.mock('../../services/educationAndWorkPlanService')

describe('retrieveEducationForUpdate', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const requestHandler = retrieveEducationForUpdate(educationAndWorkPlanService)

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
      journeyData: {},
    } as unknown as Request
    res = {} as unknown as Response

    req.journeyData.educationDto = undefined
  })

  it('should retrieve education and store in prison context given education is not already in the journeyData', async () => {
    // Given
    const educationDto = aValidEducationDto({ prisonNumber })
    educationAndWorkPlanService.getEducation.mockResolvedValue(educationDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.educationDto).toEqual(educationDto)
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
  })

  it('should not retrieve education given education is already in the journeyData', async () => {
    // Given
    const educationDto = aValidEducationDto({ prisonNumber })
    req.journeyData.educationDto = educationDto

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.educationDto).toEqual(educationDto)
    expect(educationAndWorkPlanService.getEducation).not.toHaveBeenCalled()
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

    const expectedError = createHttpError(500, 'Education for prisoner A1234BC not returned by the Education Service')

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.educationDto).toBeUndefined()
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should handle retrieval of Education given Education service returns null indicating Not Found', async () => {
    // Given
    educationAndWorkPlanService.getEducation.mockResolvedValue(null)

    const expectedError = createHttpError(404, 'Education for prisoner A1234BC not returned by the Education Service')

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.educationDto).toBeUndefined()
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalledWith(expectedError)
  })
})
