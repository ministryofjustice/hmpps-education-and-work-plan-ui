import { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import { startOfToday } from 'date-fns'
import type { CreateGoalsForm } from 'forms'
import CreateGoalsController from './createGoalsController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import futureGoalTargetDateCalculator from '../futureGoalTargetDateCalculator'
import validateCreateGoalsForm from './createGoalsFormValidator'

jest.mock('./createGoalsFormValidator')

/**
 * Unit tests for createGoalsController.
 */
describe('createGoalsController', () => {
  const mockedCreateGoalsFormValidator = validateCreateGoalsForm as jest.MockedFn<typeof validateCreateGoalsForm>

  const controller = new CreateGoalsController()

  const req = {
    session: {} as SessionData,
    body: {},
    params: {} as Record<string, string>,
    flash: jest.fn(),
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  const prisonNumber = 'A1234BC'
  const expectedPrisonId = 'MDI'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber, expectedPrisonId)
  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.params = {} as Record<string, string>

    req.params.prisonNumber = prisonNumber
    req.session.prisonerSummary = prisonerSummary

    errors = []
  })

  describe('getCreateGoalsView', () => {
    it('should get create goals view given form object is not already on the session', async () => {
      // Given
      req.session.createGoalsForm = undefined

      const expectedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: '',
            steps: [{ title: '' }],
          },
        ],
      }

      const today = startOfToday()
      const expectedFutureGoalTargetDates = [
        futureGoalTargetDateCalculator(today, 3),
        futureGoalTargetDateCalculator(today, 6),
        futureGoalTargetDateCalculator(today, 12),
      ]
      const expectedView = {
        prisonerSummary,
        form: expectedCreateGoalsForm,
        futureGoalTargetDates: expectedFutureGoalTargetDates,
        errors,
      }

      // When
      await controller.getCreateGoalsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/createGoals/index', expectedView)
      expect(req.session.createGoalsForm).toBeUndefined()
    })

    it('should get create goals view given form object is already on the session', async () => {
      // Given
      const expectedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            'targetCompletionDate-day': '31',
            'targetCompletionDate-month': '12',
            'targetCompletionDate-year': '2024',
            steps: [{ title: 'Book Course' }, { title: 'Attend Course' }],
          },
        ],
      }
      req.session.createGoalsForm = expectedCreateGoalsForm

      const today = startOfToday()
      const expectedFutureGoalTargetDates = [
        futureGoalTargetDateCalculator(today, 3),
        futureGoalTargetDateCalculator(today, 6),
        futureGoalTargetDateCalculator(today, 12),
      ]
      const expectedView = {
        prisonerSummary,
        form: expectedCreateGoalsForm,
        futureGoalTargetDates: expectedFutureGoalTargetDates,
        errors,
      }

      // When
      await controller.getCreateGoalsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/createGoals/index', expectedView)
      expect(req.session.createGoalsForm).toBeUndefined()
    })
  })

  describe('submitCreateGoalsForm', () => {
    it('should redirect to create goals form given form validation fails', async () => {
      // Given
      const expectedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: '',
            'targetCompletionDate-day': '31',
            'targetCompletionDate-month': '12',
            'targetCompletionDate-year': '2024',
            steps: [{ title: 'Book Course' }],
          },
        ],
      }
      req.body = expectedCreateGoalsForm
      req.session.createGoalsForm = undefined

      errors = [{ href: '#goals[0].title', text: 'some-title-error' }]
      mockedCreateGoalsFormValidator.mockReturnValue(errors)

      // When
      await controller.submitCreateGoalsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.createGoalsForm).toEqual(expectedCreateGoalsForm)
      expect(mockedCreateGoalsFormValidator).toHaveBeenCalledWith(expectedCreateGoalsForm)
    })
  })
})
