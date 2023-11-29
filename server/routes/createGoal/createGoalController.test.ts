import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import { SessionData } from 'express-session'
import type { CreateGoalForm } from 'forms'
import type { NewGoal } from 'compositeForms'
import moment from 'moment'
import CreateGoalController from './createGoalController'
import validateAddStepForm from './addStepFormValidator'
import validateCreateGoalForm from './createGoalFormValidator'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import { anotherValidAddStepForm, aValidAddStepForm } from '../../testsupport/addStepFormTestDataBuilder'
import { aValidCreateGoalForm } from '../../testsupport/createGoalFormTestDataBuilder'
import aValidAddNoteForm from '../../testsupport/addNoteFormTestDataBuilder'
import { aValidCreateGoalDtoWithOneStep } from '../../testsupport/createGoalDtoTestDataBuilder'
import { toCreateGoalDto } from './mappers/createGoalFormToCreateGoalDtoMapper'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import futureGoalTargetDateCalculator from '../futureGoalTargetDateCalculator'

jest.mock('./addStepFormValidator')
jest.mock('./createGoalFormValidator')
jest.mock('./mappers/createGoalFormToCreateGoalDtoMapper')

/**
 * Unit tests for createGoalController.
 */
describe('createGoalController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockedValidateCreateGoalForm = validateCreateGoalForm as jest.MockedFunction<typeof validateCreateGoalForm>
  const mockedValidateAddStepForm = validateAddStepForm as jest.MockedFunction<typeof validateAddStepForm>
  const mockedCreateGoalDtoMapper = toCreateGoalDto as jest.MockedFunction<typeof toCreateGoalDto>

  const educationAndWorkPlanService = {
    createGoals: jest.fn(),
  }

  const controller = new CreateGoalController(educationAndWorkPlanService as unknown as EducationAndWorkPlanService)

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

  const prisonNumber = 'A1234GC'
  let prisonerSummary = aValidPrisonerSummary(prisonNumber)
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

  describe('getCreateGoalView', () => {
    it('should get create goal view', async () => {
      // Given
      req.session.newGoals = undefined
      req.session.newGoal = undefined

      const expectedPrisonId = 'MDI'
      prisonerSummary = aValidPrisonerSummary(prisonNumber, expectedPrisonId)
      req.session.prisonerSummary = prisonerSummary

      const expectedCreateGoalForm = { prisonNumber } as CreateGoalForm
      const today = moment().toDate()
      const expectedFutureGoalTargetDates = [
        futureGoalTargetDateCalculator(today, 3),
        futureGoalTargetDateCalculator(today, 6),
        futureGoalTargetDateCalculator(today, 12),
      ]
      const expectedView = {
        prisonerSummary,
        form: expectedCreateGoalForm,
        futureGoalTargetDates: expectedFutureGoalTargetDates,
        errors,
      }
      const expectedNewGoal = {
        createGoalForm: expectedCreateGoalForm,
      } as NewGoal

      // When
      await controller.getCreateGoalView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/create/index', expectedView)
      expect(req.session.newGoal).toEqual(expectedNewGoal)
      expect(req.session.newGoals).toEqual([])
    })
  })

  describe('submitAddStepForm', () => {
    it('should redirect to add note form given action is submit-form and validation passes', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'
      req.params.goalIndex = '2'
      req.params.stepIndex = '1'
      req.body = {
        stepNumber: '1',
        title: 'Book French lessons',
        'targetDate-day': '31',
        'targetDate-month': '12',
        'targetDate-year': '2024',
        action: 'submit-form',
      }
      req.session.newGoal = {
        addStepForms: [],
      } as NewGoal

      mockedValidateAddStepForm.mockReturnValue([])

      // When
      await controller.submitAddStepForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234GC/goals/2/add-note')
      expect(req.flash).not.toHaveBeenCalled()
      expect(req.session.newGoal.addStepForms).toHaveLength(1)
    })

    it('should redirect to add step form given action is add-another-step and validation passes', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'
      req.params.goalIndex = '1'
      req.params.stepIndex = '1'
      req.body = {
        stepNumber: '1',
        title: 'Book French lessons',
        'targetDate-day': '31',
        'targetDate-month': '12',
        'targetDate-year': '2024',
        action: 'add-another-step',
      }
      req.session.newGoal = {
        addStepForms: [],
      } as NewGoal

      mockedValidateAddStepForm.mockReturnValue([])

      // When
      await controller.submitAddStepForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234GC/goals/1/add-step/2')
      expect(req.flash).not.toHaveBeenCalled()
      expect(req.session.newGoal.addStepForm).toEqual({ stepNumber: 2 })
      expect(req.session.newGoal.addStepForms).toHaveLength(1)
    })

    it('should redirect to add step form given validation fails', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'
      req.params.goalIndex = '2'
      req.params.stepIndex = '1'
      req.body = {}
      req.session.newGoal = {
        addStepForms: [],
      } as NewGoal

      errors = [
        { href: '#title', text: 'some-title-error' },
        { href: '#targetDate', text: 'a-target-date-error' },
      ]
      mockedValidateAddStepForm.mockReturnValue(errors)

      // When
      await controller.submitAddStepForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234GC/goals/2/add-step/1')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.newGoal.addStepForms).toHaveLength(0)
    })

    it('should add additional step', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'
      req.params.goalIndex = '3'
      req.params.stepIndex = '2'
      const addStepForm = aValidAddStepForm()
      req.body = addStepForm
      req.session.newGoal = {
        addStepForms: [anotherValidAddStepForm()],
      } as NewGoal

      mockedValidateAddStepForm.mockReturnValue([])

      // When
      await controller.submitAddStepForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.newGoal.addStepForms).toHaveLength(2)
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234GC/goals/3/add-note')
    })

    it('should not add duplicate step', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'
      req.params.goalIndex = '1'
      req.params.stepIndex = '2'
      const addStepForm = aValidAddStepForm()
      req.body = addStepForm
      req.session.newGoal = {
        addStepForms: [addStepForm],
      } as NewGoal

      mockedValidateAddStepForm.mockReturnValue([])

      // When
      await controller.submitAddStepForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.newGoal.addStepForms).toHaveLength(1)
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234GC/goals/1/add-note')
    })

    it('should update existing modified step', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'
      req.params.goalIndex = '1'
      req.params.stepIndex = '2'
      const addStepForm = aValidAddStepForm()
      req.session.newGoal = {
        addStepForms: [addStepForm],
      } as NewGoal
      const modifiedForm = aValidAddStepForm()
      modifiedForm.title = 'Find a Spanish course'
      req.body = modifiedForm

      mockedValidateAddStepForm.mockReturnValue([])

      // When
      await controller.submitAddStepForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.newGoal.addStepForms).toHaveLength(1)
      expect(req.session.newGoal.addStepForms[0].title).toEqual('Find a Spanish course')
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234GC/goals/1/add-note')
    })
  })

  describe('submitAddNoteForm', () => {
    it('should redirect to review goal page', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'
      req.session.newGoals = []
      req.session.newGoal = {
        createGoalForm: aValidCreateGoalForm(),
        addStepForm: aValidAddStepForm(),
        addNoteForm: undefined,
      } as NewGoal

      req.body = {
        note: `Some exciting note about the prisoner's new goal`,
      }

      const expectedNewGoals = [
        {
          createGoalForm: aValidCreateGoalForm(),
          addStepForm: aValidAddStepForm(),
          addNoteForm: { note: `Some exciting note about the prisoner's new goal` },
        },
      ] as Array<NewGoal>

      // When
      await controller.submitAddNoteForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234GC/goals/review')
      expect(req.session.newGoal).toBeUndefined()
      expect(req.session.newGoals).toEqual(expectedNewGoals)
    })
  })

  describe('getReviewGoalView', () => {
    it('should get review goal view', async () => {
      // Given
      const createGoalForm = aValidCreateGoalForm()
      const addStepForms = [aValidAddStepForm()]
      const addNoteForm = aValidAddNoteForm()

      req.session.newGoals = [
        {
          createGoalForm,
          addStepForms,
          addNoteForm,
        },
      ] as Array<NewGoal>

      const createGoalDto = aValidCreateGoalDtoWithOneStep()
      mockedCreateGoalDtoMapper.mockReturnValue(createGoalDto)

      const expectedPrisonId = 'MDI'
      prisonerSummary = aValidPrisonerSummary(prisonNumber, expectedPrisonId)
      req.session.prisonerSummary = prisonerSummary

      const expectedView = {
        prisonerSummary,
        goals: [createGoalDto],
      }

      // When
      await controller.getReviewGoalView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/review/index', expectedView)
      expect(mockedCreateGoalDtoMapper).toHaveBeenCalledWith(
        createGoalForm,
        addStepForms,
        addNoteForm,
        expectedPrisonId,
      )
    })
  })

  describe('submitReviewGoal', () => {
    it('should call API to create goals and redirect to Overview page', async () => {
      // Given
      req.user.token = 'some-token'
      const createGoalForm1 = aValidCreateGoalForm('Goal 1')
      const addStepForms1 = [aValidAddStepForm()]
      const addNoteForm1 = aValidAddNoteForm()
      const createGoalForm2 = aValidCreateGoalForm('Goal 2')
      const addStepForms2 = [aValidAddStepForm()]
      const addNoteForm2 = aValidAddNoteForm()

      req.session.newGoals = [
        {
          createGoalForm: createGoalForm1,
          addStepForms: addStepForms1,
          addNoteForm: addNoteForm1,
        },
        {
          createGoalForm: createGoalForm2,
          addStepForms: addStepForms2,
          addNoteForm: addNoteForm2,
        },
      ] as Array<NewGoal>

      req.body = {
        action: 'submit-form',
      }

      const createGoalDto1 = aValidCreateGoalDtoWithOneStep('Goal 1')
      const createGoalDto2 = aValidCreateGoalDtoWithOneStep('Goal 2')
      mockedCreateGoalDtoMapper.mockReturnValueOnce(createGoalDto1)
      mockedCreateGoalDtoMapper.mockReturnValueOnce(createGoalDto2)

      const expectedPrisonId = 'MDI'
      prisonerSummary = aValidPrisonerSummary(prisonNumber, expectedPrisonId)
      req.session.prisonerSummary = prisonerSummary

      // When
      await controller.submitReviewGoal(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(educationAndWorkPlanService.createGoals).toHaveBeenCalledWith(
        [createGoalDto1, createGoalDto2],
        'some-token',
      )
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
      expect(mockedCreateGoalDtoMapper).toHaveBeenCalledWith(
        createGoalForm1,
        addStepForms1,
        addNoteForm1,
        expectedPrisonId,
      )
      expect(mockedCreateGoalDtoMapper).toHaveBeenCalledWith(
        createGoalForm2,
        addStepForms2,
        addNoteForm2,
        expectedPrisonId,
      )
      expect(req.session.newGoal).toBeUndefined()
      expect(req.session.newGoals).toBeUndefined()
    })

    it('should not create goals given error calling service to create the goals', async () => {
      // Given
      req.user.token = 'some-token'
      const createGoalForm = aValidCreateGoalForm()
      const addStepForms = [aValidAddStepForm()]
      const addNoteForm = aValidAddNoteForm()

      req.session.newGoals = [
        {
          createGoalForm,
          addStepForms,
          addNoteForm,
        },
      ] as Array<NewGoal>

      req.body = {
        action: 'submit-form',
      }

      const createGoalDto = aValidCreateGoalDtoWithOneStep()
      mockedCreateGoalDtoMapper.mockReturnValue(createGoalDto)

      const expectedPrisonId = 'MDI'
      prisonerSummary = aValidPrisonerSummary(prisonNumber, expectedPrisonId)
      req.session.prisonerSummary = prisonerSummary

      educationAndWorkPlanService.createGoals.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(500, `Error updating plan for prisoner ${prisonNumber}`)

      // When
      await controller.submitReviewGoal(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(educationAndWorkPlanService.createGoals).toHaveBeenCalledWith([createGoalDto], 'some-token')
      expect(mockedCreateGoalDtoMapper).toHaveBeenCalledWith(
        createGoalForm,
        addStepForms,
        addNoteForm,
        expectedPrisonId,
      )
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.newGoals).not.toBeUndefined()
    })

    it('should redirect to create goal form given action is add-another-goal', async () => {
      // Given
      req.user.token = 'some-token'
      const createGoalForm = aValidCreateGoalForm()
      const addStepForms = [aValidAddStepForm()]
      const addNoteForm = aValidAddNoteForm()

      req.session.newGoals = [
        {
          createGoalForm,
          addStepForms,
          addNoteForm,
        },
      ] as Array<NewGoal>

      req.body = {
        action: 'add-another-goal',
      }

      prisonerSummary = aValidPrisonerSummary(prisonNumber)
      req.session.prisonerSummary = prisonerSummary

      // When
      await controller.submitReviewGoal(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/2/create`)
      expect(mockedCreateGoalDtoMapper).not.toHaveBeenCalled()
      expect(educationAndWorkPlanService.createGoals).not.toHaveBeenCalled()
      expect(req.session.newGoal).toBeUndefined()
      expect(req.session.newGoals).not.toBeUndefined()
    })
  })
})
