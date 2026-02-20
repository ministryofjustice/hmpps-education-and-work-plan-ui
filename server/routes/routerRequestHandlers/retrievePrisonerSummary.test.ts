import createError from 'http-errors'
import { Request, Response } from 'express'
import PrisonerService from '../../services/prisonerService'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import retrievePrisonerSummary from './retrievePrisonerSummary'

jest.mock('../../services/prisonerService')

describe('retrievePrisonerSummary', () => {
  const prisonerService = new PrisonerService(null, null) as jest.Mocked<PrisonerService>
  const requestHandler = retrievePrisonerSummary(prisonerService)

  const username = 'a-dps-user'
  const prisonNumber = 'A1234GC'

  const req = {
    user: { username },
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    locals: {},
  } as unknown as Response

  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals.prisonerSummary = undefined
    req.middleware = undefined
  })

  it('should retrieve prisoner and store on res.locals', async () => {
    // Given
    const prisonId = 'MDI'
    const expectedPrisonerSummary = aValidPrisonerSummary({ prisonNumber, prisonId })
    prisonerService.getPrisonerByPrisonNumber.mockResolvedValue(expectedPrisonerSummary)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(prisonerService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    expect(res.locals.prisonerSummary).toEqual(expectedPrisonerSummary)
    expect(req.middleware.prisonerData).toEqual(expectedPrisonerSummary)
    expect(next).toHaveBeenCalled()
  })

  it('should call next function with error given retrieving prisoner fails with a 404', async () => {
    // Given
    prisonerService.getPrisonerByPrisonNumber.mockRejectedValue(createError(404, 'Not Found'))
    const expectedError = createError(404, `Prisoner ${prisonNumber} not returned by the Prisoner Search Service API`)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(prisonerService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    expect(res.locals.prisonerSummary).toBeUndefined()
    expect(req.middleware?.prisonerData).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should call next function with error given retrieving prisoner fails with a 500', async () => {
    // Given
    prisonerService.getPrisonerByPrisonNumber.mockRejectedValue(createError(500, 'Service unavailable'))
    const expectedError = createError(500, `Prisoner ${prisonNumber} not returned by the Prisoner Search Service API`)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(prisonerService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    expect(res.locals.prisonerSummary).toBeUndefined()
    expect(req.middleware?.prisonerData).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expectedError)
  })
})
