import { Request, Response } from 'express'
import retrieveSupportForAdditionalNeedsChallenges from './retrieveSupportForAdditionalNeedsChallenges'
import { aValidChallengeResponse } from '../../testsupport/challengeResponseTestDataBuilder'
import SupportAdditionalNeedsService from '../../services/supportAdditionalNeedsService'

jest.mock('../../services/supportAdditionalNeedsService')

describe('retrieveSupportForAdditionalNeedsChallenges', () => {
  const supportAdditionalNeedsService = new SupportAdditionalNeedsService(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsService>
  const requestHandler = retrieveSupportForAdditionalNeedsChallenges(supportAdditionalNeedsService)
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

  it('should retrieve challenges and store in res.locals', async () => {
    // Given
    const expectedChallenge = [aValidChallengeResponse()]
    supportAdditionalNeedsService.getChallenges.mockResolvedValue(expectedChallenge)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.challenges.isFulfilled()).toEqual(true)
    expect(res.locals.challenges.value).toEqual(expectedChallenge)
    expect(supportAdditionalNeedsService.getChallenges).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store unfulfilled result on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    supportAdditionalNeedsService.getChallenges.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.challenges.isFulfilled()).toEqual(false)
    expect(supportAdditionalNeedsService.getChallenges).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
