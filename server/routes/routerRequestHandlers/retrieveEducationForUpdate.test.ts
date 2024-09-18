import { Request, Response } from 'express'
import createHttpError from 'http-errors'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import retrieveEducationForUpdate from './retrieveEducationForUpdate'
import aValidEducationDto from '../../testsupport/educationDtoTestDataBuilder'
import getPrisonerContext from '../../data/session/prisonerContexts'

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
      session: {},
    } as unknown as Request
    res = {} as unknown as Response

    getPrisonerContext(req.session, prisonNumber).educationDto = undefined
  })

  it('should retrieve education and store in prison context', async () => {
    // Given
    const educationDto = aValidEducationDto({ prisonNumber })
    educationAndWorkPlanService.getEducation.mockResolvedValue(educationDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(educationDto)
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

    const expectedError = createHttpError(500, 'Education for prisoner A1234BC not returned by the Education Service')

    // When
    await requestHandler(req, res, next)

    // Then
    expect(getPrisonerContext(req.session, prisonNumber).educationDto).toBeUndefined()
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalledWith(expectedError)
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

    const expectedError = createHttpError(404, 'Education for prisoner A1234BC not returned by the Education Service')

    // When
    await requestHandler(req, res, next)

    // Then
    expect(getPrisonerContext(req.session, prisonNumber).educationDto).toBeUndefined()
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalledWith(expectedError)
  })
})
