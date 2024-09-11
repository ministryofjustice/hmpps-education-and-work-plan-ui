import type { EducationDto } from 'dto'
import { Request, Response } from 'express'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import retrieveEducation from './retrieveEducation'
import aValidEducationDto from '../../testsupport/educationDtoTestDataBuilder'

jest.mock('../../services/educationAndWorkPlanService')
describe('retrieveEducation', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const requestHandler = retrieveEducation(educationAndWorkPlanService)

  const prisonNumber = 'A1234BC'
  const userToken = 'a-user-token'

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      user: {
        token: userToken,
      },
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

    const expected = {
      problemRetrievingData: false,
      educationDto,
    }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.education).toEqual(expected)
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, userToken)
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

    const expected = {
      problemRetrievingData: true,
      educationDto: undefined as EducationDto,
    }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.education).toEqual(expected)
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, userToken)
    expect(next).toHaveBeenCalled()
  })

  it('should handle retrieval of Education given Education service returns Not Found', async () => {
    // Given
    const educationServiceError = {
      status: 404,
      data: {
        status: 404,
        userMessage: `Education not found for prisoner [${prisonNumber}]`,
        developerMessage: `Education not found for prisoner [${prisonNumber}]`,
      },
    }
    educationAndWorkPlanService.getEducation.mockRejectedValue(educationServiceError)

    const expected = {
      problemRetrievingData: false,
      educationDto: undefined as EducationDto,
    }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.education).toEqual(expected)
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, userToken)
    expect(next).toHaveBeenCalled()
  })
})
