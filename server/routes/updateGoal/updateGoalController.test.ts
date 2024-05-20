import createError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { ActionPlan } from 'viewModels'
import type { UpdateGoalForm } from 'forms'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import UpdateGoalController from './updateGoalController'
import { aValidActionPlanWithOneGoal, aValidGoal, aValidStep } from '../../testsupport/actionPlanTestDataBuilder'
import validateUpdateGoalForm from './updateGoalFormValidator'
import { aValidUpdateGoalForm } from '../../testsupport/updateGoalFormTestDataBuilder'
import {
  aValidUpdateGoalDtoWithMultipleSteps,
  aValidUpdateGoalDtoWithOneStep,
} from '../../testsupport/updateGoalDtoTestDataBuilder'
import { toUpdateGoalDto } from './mappers/updateGoalFormToUpdateGoalDtoMapper'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('./updateGoalFormValidator')
jest.mock('./mappers/updateGoalFormToUpdateGoalDtoMapper')

describe('updateGoalController', () => {
  const mockedValidateUpdateGoalForm = validateUpdateGoalForm as jest.MockedFunction<typeof validateUpdateGoalForm>
  const mockedUpdateGoalFormToUpdateGoalDtoMapper = toUpdateGoalDto as jest.MockedFunction<typeof toUpdateGoalDto>

  const educationAndWorkPlanService = {
    getActionPlan: jest.fn(),
    updateGoal: jest.fn(),
  }

  const controller = new UpdateGoalController(educationAndWorkPlanService as unknown as EducationAndWorkPlanService)

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
  }
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  const prisonNumber = 'A1234GC'
  const goalReference = '1a2eae63-8102-4155-97cb-43d8fb739caf'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber, 'BXI')
  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>

    req.params.prisonNumber = prisonNumber
    req.params.goalReference = goalReference
    req.session.prisonerSummary = prisonerSummary

    errors = []
  })

  describe('getUpdateGoalView', () => {
    it('should get update goal view', async () => {
      // Given
      const step = aValidStep()
      const goal = aValidGoal({ goalReference, steps: [step] })
      const actionPlan = aValidActionPlanWithOneGoal({ prisonNumber, goal })
      educationAndWorkPlanService.getActionPlan.mockResolvedValue(actionPlan)

      const updateGoalForm = {
        reference: goal.goalReference,
        title: goal.title,
        createdAt: goal.createdAt.toISOString(),
        targetCompletionDate: '2024-02-29',
        'targetCompletionDate-day': null,
        'targetCompletionDate-month': null,
        'targetCompletionDate-year': null,
        status: goal.status,
        note: goal.note,
        steps: [
          {
            reference: goal.steps[0].stepReference,
            title: goal.steps[0].title,
            stepNumber: goal.steps[0].sequenceNumber,
            status: goal.steps[0].status,
          },
        ],
        originalTargetCompletionDate: '2024-02-29',
      } as UpdateGoalForm
      const expectedView = {
        prisonerSummary,
        form: updateGoalForm,
        goalTargetDate: {
          text: 'by 29 February 2024 (goal created on 16 January 2023)',
          value: '2024-02-29',
        },
      }

      // When
      await controller.getUpdateGoalView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/update/index', expectedView)
      expect(req.session.updateGoalForm).toBeUndefined()
    })

    it('should not get update goal view given error getting prisoner action plan', async () => {
      // Given
      const actionPlan = { problemRetrievingData: true } as ActionPlan
      educationAndWorkPlanService.getActionPlan.mockResolvedValue(actionPlan)

      const expectedError = createError(500, `Error retrieving plan for prisoner ${prisonNumber}`)

      // When
      await controller.getUpdateGoalView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.updateGoalForm).toBeUndefined()
    })

    it('should not get update goal view given requested goal reference is not part of the prisoners action plan', async () => {
      // Given
      const someOtherGoalReference = 'd31d22bc-b9be-4d13-9e47-d633d6815454'
      const goal = aValidGoal({ goalReference: someOtherGoalReference })
      const actionPlan = aValidActionPlanWithOneGoal({ prisonNumber, goal })
      educationAndWorkPlanService.getActionPlan.mockResolvedValue(actionPlan)

      const expectedError = createError(404, `Goal ${goalReference} does not exist in the prisoner's plan`)

      // When
      await controller.getUpdateGoalView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.updateGoalForm).toBeUndefined()
    })
  })

  describe('submitUpdateGoalForm', () => {
    it('should redirect to review updated goal page given action is submit-form and validation passes', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'

      const updateGoalForm = aValidUpdateGoalForm(goalReference)
      updateGoalForm.action = 'submit-form'
      req.body = { ...updateGoalForm }

      mockedValidateUpdateGoalForm.mockReturnValue([])

      // When
      await controller.submitUpdateGoalForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/${goalReference}/update/review`)
      expect(mockedValidateUpdateGoalForm).toHaveBeenCalledWith(updateGoalForm)
    })

    it('should redirect to update goal with new blank step given action is add-another-step and validation passes', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'

      const updateGoalForm = aValidUpdateGoalForm(goalReference)
      updateGoalForm.action = 'add-another-step'
      req.body = { ...updateGoalForm }

      mockedValidateUpdateGoalForm.mockReturnValue([])

      const expectedUpdateGoalForm = { ...updateGoalForm }
      expectedUpdateGoalForm.steps = [...updateGoalForm.steps, { status: 'NOT_STARTED', stepNumber: 3 }]

      // When
      await controller.submitUpdateGoalForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(mockedValidateUpdateGoalForm).toHaveBeenCalledWith(updateGoalForm)
      expect(educationAndWorkPlanService.updateGoal).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/${goalReference}/update#steps[2][title]`)
      expect(req.session.updateGoalForm).toEqual(expectedUpdateGoalForm)
    })

    it('should redirect to update goal form given validation fails', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'
      req.body = { reference: goalReference }

      errors = [
        { href: '#title', text: 'some-title-error' },
        { href: '#steps[0].status', text: 'some-step-status-error' },
      ]
      mockedValidateUpdateGoalForm.mockReturnValue(errors)

      const expectedUpdateGoalForm = { reference: goalReference } as UpdateGoalForm

      // When
      await controller.submitUpdateGoalForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/${goalReference}/update`, errors)
      expect(req.session.updateGoalForm).toEqual(expectedUpdateGoalForm)
    })
  })

  describe('getReviewUpdateGoalView', () => {
    it('should get review update goal view', async () => {
      // Given
      const updateGoalForm = aValidUpdateGoalForm(goalReference)
      req.session.updateGoalForm = updateGoalForm

      const expectedUpdateGoalDto = aValidUpdateGoalDtoWithMultipleSteps()
      mockedUpdateGoalFormToUpdateGoalDtoMapper.mockReturnValue(expectedUpdateGoalDto)

      const expectedView = {
        prisonerSummary,
        data: expectedUpdateGoalDto,
      }

      // When
      await controller.getReviewUpdateGoalView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/update/review', expectedView)
      expect(mockedUpdateGoalFormToUpdateGoalDtoMapper).toHaveBeenCalledWith(updateGoalForm, 'BXI')
    })
  })

  describe('submitReviewUpdateGoal', () => {
    it('should update goal and redirect to Overview page', async () => {
      // Given
      req.user.token = 'some-token'
      req.params.prisonNumber = 'A1234GC'
      const updateGoalForm = aValidUpdateGoalForm(goalReference)
      req.session.updateGoalForm = updateGoalForm

      const expectedUpdateGoalDto = aValidUpdateGoalDtoWithOneStep()
      mockedUpdateGoalFormToUpdateGoalDtoMapper.mockReturnValue(expectedUpdateGoalDto)

      // When
      await controller.submitReviewUpdateGoal(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(educationAndWorkPlanService.updateGoal).toHaveBeenCalledWith(
        'A1234GC',
        expectedUpdateGoalDto,
        'some-token',
      )
      expect(mockedUpdateGoalFormToUpdateGoalDtoMapper).toHaveBeenCalledWith(updateGoalForm, prisonerSummary.prisonId)
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
      expect(req.session.updateGoalForm).toBeUndefined()
    })

    it('should not update goal given error calling service to update the goal', async () => {
      // Given
      req.user.token = 'some-token'
      req.params.prisonNumber = 'A1234GC'
      const updateGoalForm = aValidUpdateGoalForm(goalReference)
      req.session.updateGoalForm = updateGoalForm

      const expectedUpdateGoalDto = aValidUpdateGoalDtoWithOneStep()
      mockedUpdateGoalFormToUpdateGoalDtoMapper.mockReturnValue(expectedUpdateGoalDto)

      educationAndWorkPlanService.updateGoal.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(500, `Error updating plan for prisoner ${prisonNumber}`)

      // When
      await controller.submitReviewUpdateGoal(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(educationAndWorkPlanService.updateGoal).toHaveBeenCalledWith(
        'A1234GC',
        expectedUpdateGoalDto,
        'some-token',
      )
      expect(mockedUpdateGoalFormToUpdateGoalDtoMapper).toHaveBeenCalledWith(updateGoalForm, prisonerSummary.prisonId)
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.updateGoalForm).toBeUndefined()
    })
  })
})
