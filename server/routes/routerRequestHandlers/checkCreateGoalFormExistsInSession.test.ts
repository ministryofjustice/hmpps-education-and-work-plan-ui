import { NextFunction, Request, Response } from 'express'
import { SessionData } from 'express-session'
import type { NewGoal } from 'compositeForms'
import aValidNewGoalForm from '../../testsupport/newGoalFormTestDataBuilder'
import { aValidCreateGoalForm } from '../../testsupport/createGoalFormTestDataBuilder'
import checkCreateGoalFormExistsInSession from './checkCreateGoalFormExistsInSession'

describe('checkCreateGoalFormExistsInSession', () => {
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

  describe('edit mode', () => {
    const prisonNumber = 'A1234BC'
    beforeEach(() => {
      req.query.mode = 'edit'
    })

    it(`should invoke next handler given form exists in session for goal and prisoner referenced in url params`, async () => {
      // Given
      req.params.prisonNumber = prisonNumber
      req.params.goalIndex = '1'

      req.session.newGoals = [
        aValidNewGoalForm({ createGoalForm: aValidCreateGoalForm({ prisonNumber }) }),
        aValidNewGoalForm({ createGoalForm: aValidCreateGoalForm({ prisonNumber }) }),
        aValidNewGoalForm({ createGoalForm: aValidCreateGoalForm({ prisonNumber }) }),
      ]

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
  })

  describe('non-edit mode', () => {
    beforeEach(() => {
      req.query = {}
    })

    it(`should invoke next handler given form exists in session for prisoner referenced in url params`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoal = aValidNewGoalForm({
        createGoalForm: aValidCreateGoalForm({ prisonNumber }),
      })

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

    it(`should redirect to Create Goal screen given no newGoal form exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoal = undefined

      // When
      await checkCreateGoalFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/create`)
      expect(next).not.toHaveBeenCalled()
    })

    it(`should redirect to Create Goal screen given no createGoalForm form exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoal = {
        createGoalForm: undefined,
      } as NewGoal

      // When
      await checkCreateGoalFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/create`)
      expect(next).not.toHaveBeenCalled()
    })

    it(`should redirect to Create Goal screen given form exists in session but for different prisoner`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoal = aValidNewGoalForm({
        createGoalForm: aValidCreateGoalForm({ prisonNumber: 'Z9999XZ' }),
      })

      // When
      await checkCreateGoalFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/create`)
      expect(req.session.newGoal.createGoalForm).toBeUndefined()
      expect(next).not.toHaveBeenCalled()
    })
  })
})
