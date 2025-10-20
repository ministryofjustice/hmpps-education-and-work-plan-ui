import { Request, Response } from 'express'
import retrieveSupportForAdditionalNeedsSupportStrategies from './retrieveSupportForAdditionalNeedsSupportStrategies'
import { aValidSupportStrategyResponse } from '../../testsupport/supportStrategyResponseTestDataBuilder'
import SupportAdditionalNeedsService from '../../services/supportAdditionalNeedsService'

jest.mock('../../services/supportAdditionalNeedsService')

describe('retrieveSupportForAdditionalNeedsSupportStrategies', () => {
  const supportAdditionalNeedsService = new SupportAdditionalNeedsService(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsService>
  const requestHandler = retrieveSupportForAdditionalNeedsSupportStrategies(supportAdditionalNeedsService)
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

  it('should retrieve current support strategies and store in res.locals', async () => {
    // Given
    const expectedSupportStrategy = [aValidSupportStrategyResponse()]
    supportAdditionalNeedsService.getSupportStrategies.mockResolvedValue(expectedSupportStrategy)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.supportStrategies.isFulfilled()).toEqual(true)
    expect(res.locals.supportStrategies.value).toEqual(expectedSupportStrategy)
    expect(supportAdditionalNeedsService.getSupportStrategies).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store unfulfilled result on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    supportAdditionalNeedsService.getSupportStrategies.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.supportStrategies.isFulfilled()).toEqual(false)
    expect(supportAdditionalNeedsService.getSupportStrategies).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
