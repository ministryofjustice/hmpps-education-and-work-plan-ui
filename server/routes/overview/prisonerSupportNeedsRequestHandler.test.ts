import { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import { CuriousService } from '../../services'
import PrisonerSupportNeedsRequestHandler from './prisonerSupportNeedsRequestHandler'
import aValidPrisonerSupportNeeds from '../../testsupport/supportNeedsTestDataBuilder'

describe('prisonerSupportNeedsRequestHandler', () => {
  const curiousService = {
    getPrisonerSupportNeeds: jest.fn(),
  }

  const requestHandler = new PrisonerSupportNeedsRequestHandler(curiousService as unknown as CuriousService)

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>
  })

  it('should retrieve support needs and store in session given support needs not in session', async () => {
    // Given
    req.session.supportNeeds = undefined
    const username = 'a-dps-user'
    req.user.username = username

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber

    const supportNeeds = aValidPrisonerSupportNeeds()
    curiousService.getPrisonerSupportNeeds.mockResolvedValue(supportNeeds)

    // When
    await requestHandler.getPrisonerSupportNeeds(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(curiousService.getPrisonerSupportNeeds).toHaveBeenCalledWith(prisonNumber, username)
    expect(req.session.supportNeeds).toEqual(supportNeeds)
    expect(next).toHaveBeenCalled()
  })

  it('should not retrieve support needs given support needs already in session', async () => {
    // Given
    const supportNeeds = aValidPrisonerSupportNeeds()
    req.session.supportNeeds = supportNeeds
    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber

    // When
    await requestHandler.getPrisonerSupportNeeds(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(curiousService.getPrisonerSupportNeeds).not.toHaveBeenCalled()
    expect(req.session.supportNeeds).toEqual(supportNeeds)
    expect(next).toHaveBeenCalled()
  })

  it('should call next function with error given retrieving support needs fails', async () => {
    // Given
    req.session.supportNeeds = undefined
    const username = 'a-dps-user'
    req.user.username = username

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber

    curiousService.getPrisonerSupportNeeds.mockRejectedValue(Error('some error'))

    // When
    await requestHandler.getPrisonerSupportNeeds(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(curiousService.getPrisonerSupportNeeds).toHaveBeenCalledWith(prisonNumber, username)
    expect(req.session.supportNeeds.problemRetrievingData).toBeTruthy()
    expect(next).toHaveBeenCalled()
  })
})
