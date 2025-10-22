import { Request, Response } from 'express'
import retrieveSupportForAdditionalNeedsAlnScreeners from './retrieveSupportForAdditionalNeedsAlnScreeners'
import { aValidAlnScreenerList } from '../../testsupport/alnScreenerDtoTestDataBuilder'
import SupportAdditionalNeedsService from '../../services/supportAdditionalNeedsService'

jest.mock('../../services/supportAdditionalNeedsService')

describe('retrieveSupportForAdditionalNeedsAlnScreeners', () => {
  const supportAdditionalNeedsService = new SupportAdditionalNeedsService(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsService>
  const requestHandler = retrieveSupportForAdditionalNeedsAlnScreeners(supportAdditionalNeedsService)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'

  const apiErrorCallback = jest.fn()
  const req = {
    user: { username },
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals = { user: undefined, apiErrorCallback }
  })

  it('should retrieve ALN Screeners and store on res.locals', async () => {
    // Given
    const expectedAlnScreenerList = aValidAlnScreenerList({ prisonNumber })
    supportAdditionalNeedsService.getAlnScreeners.mockResolvedValue(expectedAlnScreenerList)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.alnScreeners.isFulfilled()).toEqual(true)
    expect(res.locals.alnScreeners.value).toEqual(expectedAlnScreenerList)
    expect(supportAdditionalNeedsService.getAlnScreeners).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store un-fulfilled promise on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    supportAdditionalNeedsService.getAlnScreeners.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.alnScreeners.isFulfilled()).toEqual(false)
    expect(supportAdditionalNeedsService.getAlnScreeners).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
