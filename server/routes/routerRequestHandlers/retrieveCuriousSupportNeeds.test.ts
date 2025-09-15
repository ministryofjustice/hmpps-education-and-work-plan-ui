import { Request, Response } from 'express'
import CuriousService from '../../services/curiousService'
import aValidPrisonerSupportNeeds from '../../testsupport/supportNeedsTestDataBuilder'
import retrieveCuriousSupportNeeds from './retrieveCuriousSupportNeeds'

jest.mock('../../services/curiousService')

describe('retrieveCuriousSupportNeeds', () => {
  const curiousService = new CuriousService(null) as jest.Mocked<CuriousService>
  const requestHandler = retrieveCuriousSupportNeeds(curiousService)

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

  it('should retrieve curious support needs and store on res.locals', async () => {
    // Given
    const expectedSupportNeeds = aValidPrisonerSupportNeeds()
    curiousService.getPrisonerSupportNeeds.mockResolvedValue(expectedSupportNeeds)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.prisonerSupportNeeds.isFulfilled()).toEqual(true)
    expect(res.locals.prisonerSupportNeeds.value).toEqual(expectedSupportNeeds)
    expect(curiousService.getPrisonerSupportNeeds).toHaveBeenCalledWith(prisonNumber)
    expect(next).toHaveBeenCalled()
  })

  it('should store un-fulfilled promise on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    curiousService.getPrisonerSupportNeeds.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.prisonerSupportNeeds.isFulfilled()).toEqual(false)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
