import { Request, Response } from 'express'
import retrieveSupportForAdditionalNeedsConditions from './retrieveSupportForAdditionalNeedsConditions'
import { aValidConditionsList } from '../../testsupport/conditionDtoTestDataBuilder'
import SupportAdditionalNeedsService from '../../services/supportAdditionalNeedsService'

jest.mock('../../services/supportAdditionalNeedsService')

describe('retrieveSupportForAdditionalNeedsConditions', () => {
  const supportAdditionalNeedsService = new SupportAdditionalNeedsService(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsService>
  const requestHandler = retrieveSupportForAdditionalNeedsConditions(supportAdditionalNeedsService)

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

  it('should retrieve Conditions and store on res.locals', async () => {
    // Given
    const expectedConditionsList = aValidConditionsList({ prisonNumber })
    supportAdditionalNeedsService.getConditions.mockResolvedValue(expectedConditionsList)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.conditions.isFulfilled()).toEqual(true)
    expect(res.locals.conditions.value).toEqual(expectedConditionsList)
    expect(supportAdditionalNeedsService.getConditions).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store un-fulfilled promise on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    supportAdditionalNeedsService.getConditions.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.conditions.isFulfilled()).toEqual(false)
    expect(supportAdditionalNeedsService.getConditions).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
