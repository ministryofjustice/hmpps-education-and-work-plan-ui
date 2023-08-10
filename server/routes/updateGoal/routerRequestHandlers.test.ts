import { NextFunction, Response, Request } from 'express'
import { SessionData } from 'express-session'
import type { UpdateGoalForm } from 'forms'
import checkUpdateGoalFormExistsInSession from './routerRequestHandlers'

describe('routerRequestHandlers', () => {
  const req = {
    session: {} as SessionData,
    params: {} as Record<string, string>,
  }
  const res = {
    redirect: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.params = {} as Record<string, string>
  })

  describe('checkCreateGoalFormExistsInSession', () => {
    it(`should invoke next handler given form exists in session for prisoner referenced in url params`, async () => {
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

    it(`should redirect to Overview given no form exists in session`, async () => {
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
})
