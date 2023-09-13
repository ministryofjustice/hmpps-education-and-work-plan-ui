import { NextFunction, Response, Request } from 'express'
import { SessionData } from 'express-session'
import type { UpdateGoalForm } from 'forms'
import type { NewGoal } from 'compositeForms'
import {
  checkCreateGoalFormExistsInSession,
  checkAddStepFormsArrayExistsInSession,
  checkPrisonerSummaryExistsInSession,
  checkAddNoteFormExistsInSession,
  checkUpdateGoalFormExistsInSession,
} from './routerRequestHandlers'
import { aValidAddStepForm } from '../testsupport/addStepFormTestDataBuilder'
import aValidPrisonerSummary from '../testsupport/prisonerSummaryTestDataBuilder'

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

      req.session.newGoalForm = {
        createGoalForm: {
          prisonNumber,
        },
      } as NewGoal

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

    it(`should redirect to Create Goal screen given no newGoalForm form exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoalForm = undefined

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

    it(`should redirect to Create Goal screen given no createGoalForm form exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoalForm = {
        createGoalForm: undefined,
      } as NewGoal

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

      req.session.newGoalForm = {
        createGoalForm: {
          prisonNumber: 'Z9999XZ',
        },
      } as NewGoal

      // When
      await checkCreateGoalFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/create`)
      expect(req.session.newGoalForm.createGoalForm).toBeUndefined()
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('checkAddStepFormsArrayExistsInSession', () => {
    it(`should invoke next handler given forms array exists in session and contains at least 1 element`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoalForm = {
        addStepForms: [aValidAddStepForm()],
      } as NewGoal

      // When
      await checkAddStepFormsArrayExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalled()
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it(`should redirect to Create Goal screen given no forms array exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoalForm = {
        addStepForms: undefined,
      } as NewGoal

      // When
      await checkAddStepFormsArrayExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/create`)
      expect(next).not.toHaveBeenCalled()
    })

    it(`should redirect to Add Step screen given empty forms array exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoalForm = {
        addStepForms: [],
      } as NewGoal

      // When
      await checkAddStepFormsArrayExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/add-step`)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('checkPrisonerSummaryExistsInSession', () => {
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
      expect(req.session.newGoalForm).toBeUndefined()
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('checkAddNoteFormExistsInSession', () => {
    it(`should redirect to Add Note screen given add note form does not exist in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      req.session.newGoalForm = {
        addNoteForm: undefined,
      } as NewGoal

      // When
      await checkAddNoteFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/add-note`)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('checkUpdateGoalFormExistsInSession', () => {
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
})
