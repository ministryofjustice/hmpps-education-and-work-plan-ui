import { NextFunction, Request, Response } from 'express'
import { SessionData } from 'express-session'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import checkPrisonerSummaryExistsInSession from './checkPrisonerSummaryExistsInSession'

describe('checkPrisonerSummaryExistsInSession', () => {
  const req = {
    user: {} as Express.User,
    session: {} as SessionData,
    params: {} as Record<string, string>,
    query: {} as Record<string, string>,
    path: '',
  }
  const res = {
    redirect: jest.fn(),
    locals: {} as Record<string, unknown>,
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.user = {} as Express.User
    req.session = {} as SessionData
    req.params = {} as Record<string, string>
    req.query = {} as Record<string, string>
    req.path = ''
    res.locals = {} as Record<string, unknown>
  })

  it(`should invoke next handler given prisoner summary exists in session for prisoner referenced in url params`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.session.prisonerSummary = aValidPrisonerSummary(prisonNumber)

    // When
    await checkPrisonerSummaryExistsInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Overview screen given no prisoner summary exists in session`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.session.prisonerSummary = undefined

    // When
    await checkPrisonerSummaryExistsInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
    expect(next).not.toHaveBeenCalled()
  })

  it(`should redirect to Overview screen given prisoner summary exists in session but for different prisoner`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.session.prisonerSummary = aValidPrisonerSummary('Z9999XZ')

    // When
    await checkPrisonerSummaryExistsInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
