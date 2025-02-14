import createError from 'http-errors'
import { Request, Response } from 'express'
import PrisonerSearchService from '../../services/prisonerSearchService'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import retrievePrisonerSummary from './retrievePrisonerSummary'

jest.mock('../../services/prisonerSearchService')

describe('retrievePrisonerSummary', () => {
  const prisonerSearchService = new PrisonerSearchService(null, null, null) as jest.Mocked<PrisonerSearchService>
  const requestHandler = retrievePrisonerSummary(prisonerSearchService)

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
  })

  it('should retrieve prisoner and store on res.locals', async () => {
    // Given
    const prisonId = 'MDI'
    const expectedPrisonerSummary = aValidPrisonerSummary({ prisonNumber, prisonId })
    prisonerSearchService.getPrisonerByPrisonNumber.mockResolvedValue(expectedPrisonerSummary)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    expect(res.locals.prisonerSummary).toEqual(expectedPrisonerSummary)
    expect(next).toHaveBeenCalled()
  })

  it('should call next function with error given retrieving prisoner fails with a 404', async () => {
    // Given
    prisonerSearchService.getPrisonerByPrisonNumber.mockRejectedValue(createError(404, 'Not Found'))
    const expectedError = createError(404, `Prisoner ${prisonNumber} not returned by the Prisoner Search Service API`)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    expect(res.locals.prisonerSummary).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should call next function with error given retrieving prisoner fails with a 500', async () => {
    // Given
    prisonerSearchService.getPrisonerByPrisonNumber.mockRejectedValue(createError(500, 'Service unavailable'))
    const expectedError = createError(500, `Prisoner ${prisonNumber} not returned by the Prisoner Search Service API`)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    expect(res.locals.prisonerSummary).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expectedError)
  })
})
