import { Request, Response } from 'express'
import retrieveSupportForAdditionalNeedsStrengths from './retrieveSupportForAdditionalNeedsStrengths'
import { aValidStrengthsList } from '../../testsupport/strengthResponseDtoTestDataBuilder'
import SupportAdditionalNeedsService from '../../services/supportAdditionalNeedsService'

jest.mock('../../services/supportAdditionalNeedsService')

describe('retrieveSupportForAdditionalNeedsStrengths', () => {
  const supportAdditionalNeedsService = new SupportAdditionalNeedsService(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsService>
  const requestHandler = retrieveSupportForAdditionalNeedsStrengths(supportAdditionalNeedsService)

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

  it('should retrieve Strengths and store on res.locals', async () => {
    // Given
    const expectedStrengthsList = aValidStrengthsList({ prisonNumber })
    supportAdditionalNeedsService.getStrengths.mockResolvedValue(expectedStrengthsList)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.strengths.isFulfilled()).toEqual(true)
    expect(res.locals.strengths.value).toEqual(expectedStrengthsList)
    expect(supportAdditionalNeedsService.getStrengths).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store un-fulfilled promise on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    supportAdditionalNeedsService.getStrengths.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.strengths.isFulfilled()).toEqual(false)
    expect(supportAdditionalNeedsService.getStrengths).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
