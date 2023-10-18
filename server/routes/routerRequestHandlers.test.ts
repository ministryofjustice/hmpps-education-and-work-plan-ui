import { NextFunction, Response, Request } from 'express'
import { SessionData } from 'express-session'
import type { UpdateGoalForm } from 'forms'
import type { NewGoal } from 'compositeForms'
import createError from 'http-errors'
import {
  checkCreateGoalFormExistsInSession,
  checkAddStepFormsArrayExistsInSession,
  checkPrisonerSummaryExistsInSession,
  checkUpdateGoalFormExistsInSession,
  checkNewGoalsFormExistsInSession,
  retrievePrisonerSummaryIfNotInSession,
} from './routerRequestHandlers'
import { aValidAddStepForm } from '../testsupport/addStepFormTestDataBuilder'
import aValidPrisonerSummary from '../testsupport/prisonerSummaryTestDataBuilder'
import { aValidCreateGoalForm } from '../testsupport/createGoalFormTestDataBuilder'
import aValidAddNoteForm from '../testsupport/addNoteFormTestDataBuilder'
import { PrisonerSearchService } from '../services'

describe('routerRequestHandlers', () => {
  const req = {
    user: {} as Express.User,
    session: {} as SessionData,
    params: {} as Record<string, string>,
  }
  const res = {
    redirect: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.user = {} as Express.User
    req.session = {} as SessionData
    req.params = {} as Record<string, string>
  })

  describe('checkCreateGoalFormExistsInSession', () => {
    it(`should invoke next handler given form exists in session for prisoner referenced in url params`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoal = {
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
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/create`)
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
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/create`)
      expect(next).not.toHaveBeenCalled()
    })

    it(`should redirect to Create Goal screen given form exists in session but for different prisoner`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoal = {
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
      expect(req.session.newGoal.createGoalForm).toBeUndefined()
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('checkAddStepFormsArrayExistsInSession', () => {
    it(`should invoke next handler given forms array exists in session and contains at least 1 element`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoal = {
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

      req.session.newGoal = {
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

      req.session.newGoal = {
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
      expect(req.session.newGoal).toBeUndefined()
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

  describe('checkNewGoalsFormExistsInSession', () => {
    it(`should invoke next handler given NewGoal array exists in session with at least 1 element`, async () => {
      // Given
      req.session.newGoals = [
        {
          createGoalForm: aValidCreateGoalForm(),
          addStepForms: [aValidAddStepForm()],
          addNoteForm: aValidAddNoteForm(),
        },
      ] as Array<NewGoal>

      // When
      await checkNewGoalsFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalled()
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it(`should redirect to Create Goal screen given no NewGoal array exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoals = undefined

      // When
      await checkNewGoalsFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/create`)
      expect(next).not.toHaveBeenCalled()
    })

    it(`should redirect to Add Note screen given an empty NewGoal array exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoals = []

      // When
      await checkNewGoalsFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/add-note`)
      expect(next).not.toHaveBeenCalled()
    })

    it(`should redirect to Add Note screen given NewGoal array exists in session with at least 1 element that has no AddNoteForm`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoals = [
        {
          createGoalForm: aValidCreateGoalForm(),
          addStepForms: [aValidAddStepForm()],
          addNoteForm: undefined,
        },
      ] as Array<NewGoal>

      // When
      await checkNewGoalsFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/add-note`)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('retrievePrisonerSummaryIfNotInSession', () => {
    const prisonerSearchService = {
      getPrisonerByPrisonNumber: jest.fn(),
    }

    const requestHandler = retrievePrisonerSummaryIfNotInSession(
      prisonerSearchService as unknown as PrisonerSearchService,
    )

    it('should retrieve prisoner and store in session given prisoner not in session', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      req.session.prisonerSummary = undefined

      const prisonNumber = 'A1234GC'
      const prisonId = 'MDI'
      req.params.prisonNumber = prisonNumber
      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)
      prisonerSearchService.getPrisonerByPrisonNumber.mockResolvedValue(expectedPrisonerSummary)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
      expect(req.session.prisonerSummary).toEqual(expectedPrisonerSummary)
      expect(next).toHaveBeenCalled()
    })

    it('should retrieve prisoner and store in session given different prisoner already in session', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      req.session.prisonerSummary = aValidPrisonerSummary('Z1234XY', 'BXI')

      const prisonNumber = 'A1234GC'
      const prisonId = 'MDI'
      req.params.prisonNumber = prisonNumber
      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)
      prisonerSearchService.getPrisonerByPrisonNumber.mockResolvedValue(expectedPrisonerSummary)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
      expect(req.session.prisonerSummary).toEqual(expectedPrisonerSummary)
      expect(next).toHaveBeenCalled()
    })

    it('should not retrieve prisoner given prisoner already in session', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      const prisonNumber = 'A1234GC'
      const prisonId = 'MDI'

      req.session.prisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)

      req.params.prisonNumber = prisonNumber
      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(prisonerSearchService.getPrisonerByPrisonNumber).not.toHaveBeenCalled()
      expect(req.session.prisonerSummary).toEqual(expectedPrisonerSummary)
      expect(next).toHaveBeenCalled()
    })

    it('should call next function with error given retrieving prisoner fails with a 404', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      req.session.prisonerSummary = undefined

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      prisonerSearchService.getPrisonerByPrisonNumber.mockRejectedValue(createError(404, 'Not Found'))
      const expectedError = createError(404, `Prisoner ${prisonNumber} not returned by the Prisoner Search Service API`)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
      expect(req.session.prisonerSummary).toBeUndefined()
      expect(next).toHaveBeenCalledWith(expectedError)
    })

    it('should call next function with error given retrieving prisoner fails with a 500', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      req.session.prisonerSummary = undefined

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      prisonerSearchService.getPrisonerByPrisonNumber.mockRejectedValue(createError(500, 'Not Found'))
      const expectedError = createError(500, `Prisoner ${prisonNumber} not returned by the Prisoner Search Service API`)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
      expect(req.session.prisonerSummary).toBeUndefined()
      expect(next).toHaveBeenCalledWith(expectedError)
    })
  })
})
