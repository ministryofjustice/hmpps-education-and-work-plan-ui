import { NextFunction, Request, Response } from 'express'
import type { UpdateGoalForm } from 'forms'
import { SessionData } from 'express-session'
import checkUpdateGoalFormExistsInSession from './checkUpdateGoalFormExistsInSession'

describe('checkUpdateGoalFormExistsInSession', () => {
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

  it(`should invoke next handler given update goal form exists in session`, async () => {
    // Given
    const reference = '1a2eae63-8102-4155-97cb-43d8fb739caf'

    req.session.updateGoalForm = {
      reference,
    } as UpdateGoalForm

    // When
    await checkUpdateGoalFormExistsInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Overview page given no update goal form exists in session`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.session.updateGoalForm = undefined

    // When
    await checkUpdateGoalFormExistsInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
