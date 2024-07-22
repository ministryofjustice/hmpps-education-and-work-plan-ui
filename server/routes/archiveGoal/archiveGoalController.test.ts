import { Request, Response } from 'express'
import type { ActionPlan } from 'viewModels'
import type { ArchiveGoalForm } from 'forms'
import createError from 'http-errors'
import type { ArchiveGoalDto } from 'dto'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import AuditService from '../../services/auditService'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import ArchiveGoalController from './archiveGoalController'
import { aValidActionPlanWithOneGoal, aValidGoal, aValidStep } from '../../testsupport/actionPlanTestDataBuilder'
import validateArchiveGoalForm from './archiveGoalFormValidator'
import aValidArchiveGoalForm from '../../testsupport/archiveGoalFormTestDataBuilder'
import ReasonToArchiveGoalValue from '../../enums/ReasonToArchiveGoalValue'
import toArchiveGoalDto from './mappers/archiveGoalFormToDtoMapper'
import { AuditEvent } from '../../data/hmppsAuditClient'

jest.mock('../../services/educationAndWorkPlanService')
jest.mock('../../services/auditService')
jest.mock('./archiveGoalFormValidator')
jest.mock('./mappers/archiveGoalFormToDtoMapper')

describe('archiveGoalController', () => {
  const mockedValidateArchiveGoalForm = validateArchiveGoalForm as jest.MockedFunction<typeof validateArchiveGoalForm>
  const mockedArchiveGoalFormToArchiveGoalDtoMapper = toArchiveGoalDto as jest.MockedFunction<typeof toArchiveGoalDto>

  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ArchiveGoalController(educationAndWorkPlanService, auditService)

  const prisonNumber = 'A1234GC'
  const goalReference = '1a2eae63-8102-4155-97cb-43d8fb739caf'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber, 'BXI')
  const requestId = 'deff305c-2460-4d07-853e-f8762a8a52c6'

  const req = {
    session: { prisonerSummary },
    body: {},
    user: { token: 'some-token', username: 'a-dps-user' },
    params: { prisonNumber, goalReference },
    id: requestId,
  } as unknown as Request

  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    req.session.archiveGoalForm = undefined
    req.params.prisonNumber = prisonNumber
    req.params.goalReference = goalReference

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
      await controller.getArchiveGoalView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/archive/reason', expectedView)
      expect(req.session.archiveGoalForm).toBeUndefined()
    })
    it('Should not use form from session if it is a different goal', async () => {
      // Given
      const alternativeReference = 'some other goal reference'
      const step = aValidStep()
      const goal = aValidGoal({ goalReference: alternativeReference, steps: [step] })
      const actionPlan = aValidActionPlanWithOneGoal({ prisonNumber, goal })

      req.params.goalReference = alternativeReference
      req.session.archiveGoalForm = aValidArchiveGoalForm(goalReference)

      educationAndWorkPlanService.getActionPlan.mockResolvedValue(actionPlan)
      const expectedForm: ArchiveGoalForm = {
        reference: alternativeReference,
        title: goal.title,
      }
      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getArchiveGoalView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/archive/reason', expectedView)
      expect(req.session.archiveGoalForm).toBeUndefined()
      expect(educationAndWorkPlanService.getActionPlan).toHaveBeenCalledWith(prisonNumber, 'some-token')
    })

    it('Should use form from session if it is the same goal, e.g., a validation error', async () => {
      // Given
      const archiveGoalForm = aValidArchiveGoalForm(goalReference)
      req.session.archiveGoalForm = archiveGoalForm

      const expectedView = {
        prisonerSummary,
        form: archiveGoalForm,
      }

      // When
      await controller.getArchiveGoalView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/archive/reason', expectedView)
      expect(req.session.archiveGoalForm).toBeUndefined()
      expect(educationAndWorkPlanService.getActionPlan).not.toHaveBeenCalled()
    })
    it('should not get archive goal view given error getting prisoner action plan', async () => {
      // Given
      const actionPlan = { problemRetrievingData: true } as ActionPlan
      educationAndWorkPlanService.getActionPlan.mockResolvedValue(actionPlan)

      const expectedError = createError(500, `Error retrieving plan for prisoner ${prisonNumber}`)

      // When
      await controller.getArchiveGoalView(req, res, next)

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
      await controller.getArchiveGoalView(req, res, next)

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
      await controller.submitArchiveGoalForm(req, res, next)

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
      await controller.submitArchiveGoalForm(req, res, next)

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
      await controller.getReviewArchiveGoalView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/archive/review', expectedView)
    })

    it('should redirect back to the archive reason page if no form in the session', async () => {
      // Given
      req.session.archiveGoalForm = undefined

      // When
      await controller.getReviewArchiveGoalView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/${goalReference}/archive`)
    })
  })

  describe('submitReviewArchiveGoal', () => {
    it('should request the goal is archived', async () => {
      // Given
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

      const expectedAuditEvent: AuditEvent = {
        correlationId: requestId,
        details: { goalReference },
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        what: 'ARCHIVE_PRISONER_GOAL',
        who: 'a-dps-user',
      }

      // When
      await controller.submitReviewArchiveGoal(req, res, next)

      // Then
      expect(educationAndWorkPlanService.archiveGoal).toHaveBeenCalledWith(expectedArchiveGoalDto, 'some-token')
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`, 'Goal archived')
      expect(req.session.archiveGoalForm).toBeUndefined()
      expect(auditService.logAuditEvent).toHaveBeenCalledWith(expectedAuditEvent)
    })

    it('should handle a failure archiving the goal', async () => {
      // Given
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
      await controller.submitReviewArchiveGoal(req, res, next)

      // Then
      expect(educationAndWorkPlanService.archiveGoal).toHaveBeenCalledWith(expectedArchiveGoalDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.archiveGoalForm).toBeUndefined()
      expect(auditService.logAuditEvent).not.toHaveBeenCalled()
    })
  })

  describe('cancelArchiveGoal', () => {
    it('should remove the form from the session on cancel', async () => {
      // Given
      req.session.archiveGoalForm = {
        reference: goalReference,
        title: 'Some goal',
        reason: ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
      }

      // When
      await controller.cancelArchiveGoal(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
      expect(req.session.archiveGoalForm).toBeUndefined()
      expect(auditService.logAuditEvent).not.toHaveBeenCalled()
    })
  })
})
