import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { ActionPlan } from 'viewModels'
import type { ArchiveGoalForm } from 'forms'
import createError from 'http-errors'
import type { ArchiveGoalDto } from 'dto'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import ArchiveGoalController from './archiveGoalController'

import { aValidActionPlanWithOneGoal, aValidGoal, aValidStep } from '../../testsupport/actionPlanTestDataBuilder'
import validateArchiveGoalForm from './archiveGoalFormValidator'
import aValidArchiveGoalForm from '../../testsupport/archiveGoalFormTestDataBuilder'
import ReasonToArchiveGoalValue from '../../enums/ReasonToArchiveGoalValue'
import toArchiveGoalDto from './mappers/archiveGoalFormToDtoMapper'

jest.mock('./archiveGoalFormValidator')
jest.mock('./mappers/archiveGoalFormToDtoMapper')

describe('archiveGoalController', () => {
  const educationAndWorkPlanService = {
    getActionPlan: jest.fn(),
    archiveGoal: jest.fn(),
  }
  const mockedValidateArchiveGoalForm = validateArchiveGoalForm as jest.MockedFunction<typeof validateArchiveGoalForm>
  const mockedArchiveGoalFormToArchiveGoalDtoMapper = toArchiveGoalDto as jest.MockedFunction<typeof toArchiveGoalDto>
  const controller = new ArchiveGoalController(educationAndWorkPlanService as unknown as EducationAndWorkPlanService)

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
  }
  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
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
  describe('getArchiveGoalView', () => {
    it('Should load the page with archive goal form that does not have anything selected yet', async () => {
      // Given
      const step = aValidStep()
      const goal = aValidGoal({ goalReference, steps: [step] })
      const actionPlan = aValidActionPlanWithOneGoal({ prisonNumber, goal })
      educationAndWorkPlanService.getActionPlan.mockResolvedValue(actionPlan)
      const expectedForm: ArchiveGoalForm = {
        reference: goalReference,
        title: goal.title,
      }
      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getArchiveGoalView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/archive/reason', expectedView)
      expect(req.session.archiveGoalForm).toBeUndefined()
    })

    it('should not get archive goal view given error getting prisoner action plan', async () => {
      // Given
      const actionPlan = { problemRetrievingData: true } as ActionPlan
      educationAndWorkPlanService.getActionPlan.mockResolvedValue(actionPlan)

      const expectedError = createError(500, `Error retrieving plan for prisoner ${prisonNumber}`)

      // When
      await controller.getArchiveGoalView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.archiveGoalForm).toBeUndefined()
    })

    it('should not get archive goal view given requested goal reference is not part of the prisoners action plan', async () => {
      // Given
      const someOtherGoalReference = 'd31d22bc-b9be-4d13-9e47-d633d6815454'
      const goal = aValidGoal({ goalReference: someOtherGoalReference })
      const actionPlan = aValidActionPlanWithOneGoal({ prisonNumber, goal })
      educationAndWorkPlanService.getActionPlan.mockResolvedValue(actionPlan)

      const expectedError = createError(404, `Goal ${goalReference} does not exist in the prisoner's plan`)

      // When
      await controller.getArchiveGoalView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.archiveGoalForm).toBeUndefined()
    })
  })
  describe('submitArchiveGoalForm', () => {
    it('should redirect to review archive goal page given action is submit-form and validation passes', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'

      const archiveGoalForm = aValidArchiveGoalForm(goalReference)
      req.body = { ...archiveGoalForm }

      mockedValidateArchiveGoalForm.mockReturnValue([])

      // When
      await controller.submitArchiveGoalForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/${goalReference}/archive/review`)
      expect(mockedValidateArchiveGoalForm).toHaveBeenCalledWith(archiveGoalForm)
      expect(req.session.archiveGoalForm).toStrictEqual(archiveGoalForm)
    })
    it('should redirect to archive goal form given validation fails', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'
      req.body = { reference: goalReference, title: 'Learn German' }

      errors = [{ href: '#reason', text: 'bang!' }]
      mockedValidateArchiveGoalForm.mockReturnValue(errors)

      const expectedArchiveGoalForm: ArchiveGoalForm = { reference: goalReference, title: 'Learn German' }

      // When
      await controller.submitArchiveGoalForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/plan/${prisonNumber}/goals/${goalReference}/archive`,
        errors,
      )
      expect(req.session.archiveGoalForm).toEqual(expectedArchiveGoalForm)
    })
  })
  describe('getReviewArchiveGoalView', () => {
    it('should get the view with the form in the session', async () => {
      // Given
      const expectedForm: ArchiveGoalForm = {
        reference: goalReference,
        title: 'Some goal',
        reason: ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
      }
      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }
      req.session.archiveGoalForm = expectedForm

      // When
      await controller.getReviewArchiveGoalView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/archive/review', expectedView)
    })

    it('should redirect back to the archive reason page if no form in the session', async () => {
      // Given
      req.session.archiveGoalForm = undefined

      // When
      await controller.getReviewArchiveGoalView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/${goalReference}/archive`)
    })
  })

  describe('submitReviewArchiveGoal', () => {
    it('should request the goal is archived', async () => {
      // Given
      req.user.token = 'some-token'
      req.session.archiveGoalForm = {
        reference: goalReference,
        title: 'Some goal',
        reason: ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
      }
      const expectedArchiveGoalDto: ArchiveGoalDto = {
        prisonNumber,
        goalReference,
        reason: ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
      }
      mockedArchiveGoalFormToArchiveGoalDtoMapper.mockReturnValue(expectedArchiveGoalDto)

      // When
      await controller.submitReviewArchiveGoal(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(educationAndWorkPlanService.archiveGoal).toHaveBeenCalledWith(expectedArchiveGoalDto, 'some-token')
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`, 'Goal archived')
      expect(req.session.archiveGoalForm).toBeUndefined()
    })
    it('should handle a failure archiving the goal', async () => {
      // Given
      req.user.token = 'some-token'
      req.session.archiveGoalForm = {
        reference: goalReference,
        title: 'Some goal',
        reason: ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
      }
      const expectedArchiveGoalDto: ArchiveGoalDto = {
        prisonNumber,
        goalReference,
        reason: ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
      }
      mockedArchiveGoalFormToArchiveGoalDtoMapper.mockReturnValue(expectedArchiveGoalDto)
      educationAndWorkPlanService.archiveGoal.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(500, `Error archiving goal for prisoner ${prisonNumber}`)

      // When
      await controller.submitReviewArchiveGoal(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(educationAndWorkPlanService.archiveGoal).toHaveBeenCalledWith(expectedArchiveGoalDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.archiveGoalForm).toBeUndefined()
    })
  })
})
