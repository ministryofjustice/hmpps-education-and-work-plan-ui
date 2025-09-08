import { Request, Response } from 'express'
import CuriousService from '../../services/curiousService'
import aValidPrisonerSupportNeeds from '../../testsupport/supportNeedsTestDataBuilder'
import retrieveCuriousSupportNeeds from './retrieveCuriousSupportNeeds'

jest.mock('../../services/curiousService')

describe('retrieveCuriousSupportNeeds', () => {
  const curiousService = new CuriousService(null, null) as jest.Mocked<CuriousService>
  const requestHandler = retrieveCuriousSupportNeeds(curiousService)

  const prisonNumber = 'A1234GC'
  const username = 'a-dps-user'

  let req: Request
  const res = {
    locals: {} as Record<string, unknown>,
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      user: { username },
      params: { prisonNumber },
    } as unknown as Request
  })

  it('should retrieve prisoner functional skills', async () => {
    // Given
    const expectedSupportNeeds = aValidPrisonerSupportNeeds()
    curiousService.getPrisonerSupportNeeds.mockResolvedValue(expectedSupportNeeds)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(curiousService.getPrisonerSupportNeeds).toHaveBeenCalledWith(prisonNumber, username)
    expect(res.locals.prisonerSupportNeeds).toEqual(expectedSupportNeeds)
    expect(next).toHaveBeenCalled()
  })
})
