import { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import { startOfToday } from 'date-fns'
import type { CreateGoalDto } from 'dto'
import type { CreateGoalsForm } from 'forms'
import CreateGoalsController from './createGoalsController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import futureGoalTargetDateCalculator from '../futureGoalTargetDateCalculator'
import validateCreateGoalsForm from './createGoalsFormValidator'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import toCreateGoalDtos from '../../data/mappers/createGoalDtoMapper'

jest.mock('./createGoalsFormValidator')
jest.mock('../../data/mappers/createGoalDtoMapper')
jest.mock('../../services/educationAndWorkPlanService')

/**
 * Unit tests for createGoalsController.
 */
describe('createGoalsController', () => {
  const mockedCreateGoalsFormValidator = validateCreateGoalsForm as jest.MockedFn<typeof validateCreateGoalsForm>
  const mockedCreateGoalDtosMapper = toCreateGoalDtos as jest.MockedFn<typeof toCreateGoalDtos>

  const educationAndWorkPlanService = new EducationAndWorkPlanService(null) as jest.Mocked<EducationAndWorkPlanService>
  const controller = new CreateGoalsController(educationAndWorkPlanService)

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
    it('should call API to create goals and redirect to overview given value CreateGoalsForm', async () => {
      // Given
      req.user.token = 'some-token'
      const submittedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }],
          },
        ],
        action: 'submit-form',
      }
      req.body = submittedCreateGoalsForm

      req.session.createGoalsForm = undefined

      mockedCreateGoalsFormValidator.mockReturnValue(errors)

      const expectedCreateGoalDtos: Array<CreateGoalDto> = [
        {
          prisonNumber,
          prisonId: expectedPrisonId,
          title: 'Learn French',
          steps: [{ title: 'Book Course', sequenceNumber: 1 }],
          targetCompletionDate: new Date('2024-12-31T00:00:00.000Z'),
        },
        {
          prisonNumber,
          prisonId: expectedPrisonId,
          title: 'Learn Spanish',
          steps: [{ title: 'Find available courses', sequenceNumber: 1 }],
          targetCompletionDate: new Date('2025-04-10T00:00:00.000Z'),
        },
      ]
      mockedCreateGoalDtosMapper.mockReturnValue(expectedCreateGoalDtos)

      // When
      await controller.submitCreateGoalsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/view/overview')
      expect(mockedCreateGoalsFormValidator).toHaveBeenCalledWith(submittedCreateGoalsForm)
      expect(mockedCreateGoalDtosMapper).toHaveBeenCalledWith(submittedCreateGoalsForm, expectedPrisonId)
      expect(educationAndWorkPlanService.createGoals).toHaveBeenCalledWith(expectedCreateGoalDtos, 'some-token')
      expect(req.session.createGoalsForm).toBeUndefined()
      expect(req.flash).toHaveBeenCalledWith('goalsSuccessfullyCreated', 'true')
      expect(req.flash).not.toHaveBeenCalledWith('errors')
    })

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
        action: 'submit-form',
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
      expect(req.flash).not.toHaveBeenCalledWith('goalsSuccessfullyCreated')
      expect(req.session.createGoalsForm).toEqual(expectedCreateGoalsForm)
      expect(mockedCreateGoalsFormValidator).toHaveBeenCalledWith(expectedCreateGoalsForm)
    })

    it('should add a step to a goal', async () => {
      // Given
      const submittedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
        action: 'add-another-step|1',
      }
      req.body = submittedCreateGoalsForm

      req.session.createGoalsForm = undefined

      mockedCreateGoalsFormValidator.mockReturnValue(errors)

      const expectedCreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }, { title: '' }], // expect new step as the last step of this goal
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
        action: 'add-another-step|1',
      }

      // When
      await controller.submitCreateGoalsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create#goals[1].steps[1].title')
      expect(req.session.createGoalsForm).toEqual(expectedCreateGoalsForm)
      expect(mockedCreateGoalsFormValidator).toHaveBeenCalledWith(submittedCreateGoalsForm)
    })

    Array.of(
      'add-another-step|',
      'add-another-step|-1',
      'add-another-step|A',
      'add-another-step',
      'add-another-step|2',
    ).forEach(formAction => {
      it(`should not add a step to a goal given form action ${formAction}`, async () => {
        // Given
        const submittedCreateGoalsForm: CreateGoalsForm = {
          prisonNumber,
          goals: [
            {
              title: 'Learn Spanish',
              targetCompletionDate: '2025-04-10',
              steps: [{ title: 'Find available courses' }],
            },
            {
              title: 'Attend bricklaying workshop',
              targetCompletionDate: '2024-12-31',
              steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
            },
          ],
          action: formAction,
        }
        req.body = submittedCreateGoalsForm

        req.session.createGoalsForm = undefined

        mockedCreateGoalsFormValidator.mockReturnValue(errors)

        // When
        await controller.submitCreateGoalsForm(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create')
        expect(req.session.createGoalsForm).toEqual(submittedCreateGoalsForm)
        expect(mockedCreateGoalsFormValidator).toHaveBeenCalledWith(submittedCreateGoalsForm)
      })
    })

    it('should remove a step from a goal', async () => {
      // Given
      const submittedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
        action: 'remove-step|2|1', // remove from goal 3 step 2 (zero indexed array elements)
      }
      req.body = submittedCreateGoalsForm

      req.session.createGoalsForm = undefined

      const expectedCreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Apply to get on activity' }, { title: 'Pass exam' }], // expect "Attend activity" step to be removed
          },
        ],
        action: 'remove-step|2|1',
      }

      // When
      await controller.submitCreateGoalsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create#goals[2].steps[1].title') // focus the bricklaying course as that is the last step in the goal
      expect(req.session.createGoalsForm).toEqual(expectedCreateGoalsForm)
      expect(mockedCreateGoalsFormValidator).not.toHaveBeenCalled()
    })

    Array.of(
      'remove-step||',
      'remove-step|-1|-1',
      'remove-step|1|-1',
      'remove-step|-1|1',
      'remove-step|A|1',
      'remove-step|1|A',
      'remove-step',
      'remove-step|2|0',
      'remove-step|1|3',
    ).forEach(formAction => {
      it(`should not remove a step from a goal given form action ${formAction}`, async () => {
        // Given
        const submittedCreateGoalsForm: CreateGoalsForm = {
          prisonNumber,
          goals: [
            {
              title: 'Learn Spanish',
              targetCompletionDate: '2025-04-10',
              steps: [{ title: 'Find available courses' }],
            },
            {
              title: 'Attend bricklaying workshop',
              targetCompletionDate: '2024-12-31',
              steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
            },
          ],
          action: formAction,
        }
        req.body = submittedCreateGoalsForm

        req.session.createGoalsForm = undefined

        // When
        await controller.submitCreateGoalsForm(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create')
        expect(req.session.createGoalsForm).toEqual(submittedCreateGoalsForm)
        expect(mockedCreateGoalsFormValidator).not.toHaveBeenCalled()
      })
    })

    it('should add another goal', async () => {
      // Given
      const submittedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
        action: 'add-another-goal',
      }
      req.body = submittedCreateGoalsForm

      req.session.createGoalsForm = undefined

      mockedCreateGoalsFormValidator.mockReturnValue(errors)

      const expectedCreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
          {
            title: '',
            steps: [{ title: '' }],
          },
        ],
        action: 'add-another-goal',
      }

      // When
      await controller.submitCreateGoalsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create#goals[3].title')
      expect(req.session.createGoalsForm).toEqual(expectedCreateGoalsForm)
      expect(mockedCreateGoalsFormValidator).toHaveBeenCalledWith(submittedCreateGoalsForm)
    })
  })
})
