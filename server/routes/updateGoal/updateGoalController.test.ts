import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { ActionPlan, PrisonerSummary } from 'viewModels'
import type { UpdateGoalForm } from 'forms'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import UpdateGoalController from './updateGoalController'
import { aValidActionPlanWithOneGoal, aValidGoal, aValidStep } from '../../testsupport/actionPlanTestDataBuilder'
import validateUpdateGoalForm from './updateGoalFormValidator'
import aValidUpdateGoalForm from '../../testsupport/updateGoalFormTestDataBuilder'
import { aValidUpdateGoalDtoWithOneStep } from '../../testsupport/updateGoalDtoTestDataBuilder'
import { toUpdateGoalDto } from './mappers/updateGoalFormToUpdateGoalDtoMapper'

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
    flash: jest.fn(),
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  const prisonNumber = 'A1234GC'
  const goalReference = '1a2eae63-8102-4155-97cb-43d8fb739caf'
  const prisonerSummary = { prisonNumber } as PrisonerSummary
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
      const goal = aValidGoal(goalReference, [step])
      const actionPlan = aValidActionPlanWithOneGoal(prisonNumber, [goal])
      educationAndWorkPlanService.getActionPlan.mockResolvedValue(actionPlan)

      const updateGoalForm = {
        reference: goal.goalReference,
        title: goal.title,
        reviewDate: goal.reviewDate,
        status: goal.status,
        note: goal.note,
        steps: [
          {
            reference: goal.steps[0].stepReference,
            title: goal.steps[0].title,
            targetDateRange: goal.steps[0].targetDateRange,
            stepNumber: goal.steps[0].sequenceNumber,
            status: goal.steps[0].status,
          },
        ],
      } as UpdateGoalForm
      const expectedView = {
        prisonerSummary,
        form: updateGoalForm,
        errors,
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

      // When
      await controller.getUpdateGoalView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/error')
      expect(req.session.updateGoalForm).toBeUndefined()
    })

    it('should not get update goal view given requested goal reference is not part of the prisoners action plan', async () => {
      // Given
      const someOtherGoalReference = 'd31d22bc-b9be-4d13-9e47-d633d6815454'
      const goals = [aValidGoal(someOtherGoalReference)]
      const actionPlan = aValidActionPlanWithOneGoal(prisonNumber, goals)
      educationAndWorkPlanService.getActionPlan.mockResolvedValue(actionPlan)

      // When
      await controller.getUpdateGoalView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/error')
      expect(req.session.updateGoalForm).toBeUndefined()
    })
  })

  describe('submitUpdateGoalForm', () => {
    it('should update goal and redirect to review updated goal page given action is submit-form and validation passes should redirect to the overview page', async () => {
      // Given
      req.user.token = 'some-token'
      req.params.prisonNumber = 'A1234GC'

      const updateGoalForm = aValidUpdateGoalForm(goalReference)
      updateGoalForm.action = 'submit-form'
      req.body = { ...updateGoalForm }

      mockedValidateUpdateGoalForm.mockReturnValue([])

      const expectedUpdateGoalDto = aValidUpdateGoalDtoWithOneStep()
      mockedUpdateGoalFormToUpdateGoalDtoMapper.mockReturnValue(expectedUpdateGoalDto)

      // When
      await controller.submitUpdateGoalForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        '/plan/A1234GC/goals/1a2eae63-8102-4155-97cb-43d8fb739caf/update/review',
      )

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
      expect(mockedValidateUpdateGoalForm).toHaveBeenCalledWith(updateGoalForm)
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234GC/view/overview')
      expect(req.session.updateGoalForm).toBeUndefined()
    })

    it('should redirect to update goal with new blank step given action is add-another-step and validation passes', async () => {
      // Given
      req.user.token = 'some-token'
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
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234GC/goals/1a2eae63-8102-4155-97cb-43d8fb739caf/update')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.updateGoalForm).toEqual(expectedUpdateGoalForm)
    })
  })
})
