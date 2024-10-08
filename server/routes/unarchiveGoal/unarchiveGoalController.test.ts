import { Request, Response } from 'express'
import createError from 'http-errors'
import type { ActionPlan } from 'viewModels'
import type { UnarchiveGoalForm } from 'forms'
import type { UnarchiveGoalDto } from 'dto'
import UnarchiveGoalController from './unarchiveGoalController'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import AuditService, { BaseAuditData } from '../../services/auditService'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidActionPlanWithOneGoal, aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'

jest.mock('../../services/educationAndWorkPlanService')
jest.mock('../../services/auditService')

describe('unarchiveGoalController', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new UnarchiveGoalController(educationAndWorkPlanService, auditService)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary()
  const goalReference = '1a2eae63-8102-4155-97cb-43d8fb739caf'
  const requestId = 'deff305c-2460-4d07-853e-f8762a8a52c6'

  const req = {
    session: {},
    body: {},
    user: { token: 'a-user-token', username },
    params: { prisonNumber, goalReference },
    id: requestId,
  } as unknown as Request
  const res = {
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getUnarchiveGoalView', () => {
    it('should get the unarchived goal view', async () => {
      // Given
      const goal = aValidGoal({ goalReference, title: 'Learn Spanish', status: 'ARCHIVED' })
      const actionPlan = aValidActionPlanWithOneGoal({ prisonNumber, goal })
      educationAndWorkPlanService.getActionPlan.mockResolvedValue(actionPlan)

      const expectedView = {
        prisonerSummary,
        form: {
          reference: goalReference,
          title: 'Learn Spanish',
        },
      }

      // When
      await controller.getUnarchiveGoalView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/unarchive/index', expectedView)
      expect(educationAndWorkPlanService.getActionPlan).toHaveBeenCalledWith('A1234BC', username)
    })

    it('should not get update goal view given error getting prisoner action plan', async () => {
      // Given
      const actionPlan = { problemRetrievingData: true } as ActionPlan
      educationAndWorkPlanService.getActionPlan.mockResolvedValue(actionPlan)

      const expectedError = createError(500, `Error retrieving plan for prisoner ${prisonNumber}`)

      // When
      await controller.getUnarchiveGoalView(req, res, next)

      // Then
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(educationAndWorkPlanService.getActionPlan).toHaveBeenCalledWith('A1234BC', username)
    })

    it('should not get update goal view given requested goal reference is not part of the prisoners action plan', async () => {
      // Given
      const someOtherGoalReference = 'd31d22bc-b9be-4d13-9e47-d633d6815454'
      const goal = aValidGoal({ goalReference: someOtherGoalReference })
      const actionPlan = aValidActionPlanWithOneGoal({ prisonNumber, goal })
      educationAndWorkPlanService.getActionPlan.mockResolvedValue(actionPlan)

      const expectedError = createError(404, `Goal ${goalReference} does not exist in the prisoner's plan`)

      // When
      await controller.getUnarchiveGoalView(req, res, next)

      // Then
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(educationAndWorkPlanService.getActionPlan).toHaveBeenCalledWith('A1234BC', username)
    })
  })

  describe('submitUnarchiveGoalForm', () => {
    it('should unarchive goal and redirect to Overview page', async () => {
      // Given
      const unarchiveGoalForm: UnarchiveGoalForm = {
        reference: goalReference,
        title: 'Learn Spanish',
      }
      req.body = unarchiveGoalForm

      const expectedUnarchiveGoalDto: UnarchiveGoalDto = {
        goalReference,
        prisonNumber,
      }

      const expectedBaseAuditData: BaseAuditData = {
        correlationId: requestId,
        details: { goalReference },
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        who: username,
      }

      // When
      await controller.submitUnarchiveGoalForm(req, res, next)

      // Then
      expect(educationAndWorkPlanService.unarchiveGoal).toHaveBeenCalledWith(expectedUnarchiveGoalDto, 'a-user-token')
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`, 'Goal reactivated')
      expect(auditService.logUnarchiveGoal).toHaveBeenCalledWith(expectedBaseAuditData)
    })

    it('should not unarchive goal given error calling service to unarchive the goal', async () => {
      // Given
      const unarchiveGoalForm: UnarchiveGoalForm = {
        reference: goalReference,
        title: 'Learn Spanish',
      }
      req.body = unarchiveGoalForm

      educationAndWorkPlanService.unarchiveGoal.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(500, `Error unarchiving goal for prisoner ${prisonNumber}`)

      const expectedUnarchiveGoalDto: UnarchiveGoalDto = {
        goalReference,
        prisonNumber,
      }

      // When
      await controller.submitUnarchiveGoalForm(req, res, next)

      // Then
      expect(educationAndWorkPlanService.unarchiveGoal).toHaveBeenCalledWith(expectedUnarchiveGoalDto, 'a-user-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(auditService.logUnarchiveGoal).not.toHaveBeenCalled()
    })
  })
})
