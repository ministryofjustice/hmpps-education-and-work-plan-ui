import { Request, Response } from 'express'
import CuriousService from '../../services/curiousService'
import { validCuriousAlnAndLddAssessments } from '../../testsupport/curiousAlnAndLddAssessmentsTestDataBuilder'
import retrieveCuriousAlnAndLddAssessments from './retrieveCuriousAlnAndLddAssessments'

jest.mock('../../services/curiousService')

describe('retrieveCuriousAlnAndLddAssessments', () => {
  const curiousService = new CuriousService(null) as jest.Mocked<CuriousService>
  const requestHandler = retrieveCuriousAlnAndLddAssessments(curiousService)

  const prisonNumber = 'A1234GC'

  const apiErrorCallback = jest.fn()
  let req: Request
  const res = {
    locals: { apiErrorCallback },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      params: { prisonNumber },
    } as unknown as Request
  })

  it('should retrieve ALN and LDD Assessments and store on res.locals', async () => {
    // Given
    const expectedAssessments = validCuriousAlnAndLddAssessments()
    curiousService.getAlnAndLddAssessments.mockResolvedValue(expectedAssessments)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.curiousAlnAndLddAssessments.isFulfilled()).toEqual(true)
    expect(res.locals.curiousAlnAndLddAssessments.value).toEqual(expectedAssessments)
    expect(curiousService.getAlnAndLddAssessments).toHaveBeenCalledWith(prisonNumber)
    expect(next).toHaveBeenCalled()
  })

  it('should store un-fulfilled promise on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    curiousService.getAlnAndLddAssessments.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.curiousAlnAndLddAssessments.isFulfilled()).toEqual(false)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
