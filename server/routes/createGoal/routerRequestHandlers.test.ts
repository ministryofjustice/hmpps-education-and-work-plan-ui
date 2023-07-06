import { NextFunction, Response, Request } from 'express'
import { SessionData } from 'express-session'
import type { CreateGoalForm } from 'forms'
import { checkCreateGoalFormExistsInSession } from './routerRequestHandlers'

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
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.createGoalForm = {
        prisonNumber,
      } as CreateGoalForm

      // When
      await checkCreateGoalFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalled()
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it(`should redirect to Create Goal screen given no form exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.createGoalForm = undefined

      // When
      await checkCreateGoalFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/create`)
      expect(next).not.toHaveBeenCalled()
    })

    it(`should redirect to Create Goal screen given form exists in session but for different prisoner`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.createGoalForm = {
        prisonNumber: 'Z9999XZ',
      } as CreateGoalForm

      // When
      await checkCreateGoalFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/create`)
      expect(req.session.createGoalForm).toBeUndefined()
      expect(next).not.toHaveBeenCalled()
    })
  })
})
