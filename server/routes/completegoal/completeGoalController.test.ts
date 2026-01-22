import { Request, Response } from 'express'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import AuditService, { BaseAuditData } from '../../services/auditService'
import CompleteGoalController from './completeGoalController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'
import { Result } from '../../utils/result/result'

jest.mock('../../services/educationAndWorkPlanService')
jest.mock('../../services/auditService')

describe('CompleteGoalController - submitCompleteGoalForm', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new CompleteGoalController(educationAndWorkPlanService, auditService)

  const prisonNumber = 'A1234GC'
  const prisonId = 'BXI'
  const username = 'a-dps-user'
  const goalReference = '1a2eae63-8102-4155-97cb-43d8fb739caf'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber, prisonId })
  const goal = Result.fulfilled(aValidGoal({ goalReference }))
  const requestId = 'deff305c-2460-4d07-853e-f8762a8a52c6'

  const flash = jest.fn()
  const req = {
    session: {},
    user: { username },
    params: { prisonNumber, goalReference },
    id: requestId,
    flash,
  } as unknown as Request

  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary, goal },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
  })

  describe('#submitCompleteGoalForm', () => {
    it('should get the complete goal view', async () => {
      // Given

      // When
      await controller.getCompleteGoalView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/complete/index', {
        prisonerSummary,
        goal,
        form: { notes: '' },
      })
    })
  })

  describe('submitCompleteGoalForm', () => {
    it('should complete the goal and log the audit successfully', async () => {
      // Given
      req.body = { notes: 'Great progress made' }

      const expectedCompleteGoalDto = { goalReference, prisonNumber, note: 'Great progress made', prisonId }

      const expectedBaseAuditData: BaseAuditData = {
        correlationId: requestId,
        details: { goalReference },
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        who: username,
      }

      // When
      await controller.submitCompleteGoalForm(req, res, next)

      // Then
      expect(educationAndWorkPlanService.completeGoal).toHaveBeenCalledWith(expectedCompleteGoalDto, username)
      expect(auditService.logCompleteGoal).toHaveBeenCalledWith(expectedBaseAuditData)
      expect(res.redirectWithSuccess).toHaveBeenCalledWith('/plan/A1234GC/view/overview', 'Goal Completed')
      expect(next).not.toHaveBeenCalled()
      expect(flash).toHaveBeenCalledWith('pendingRedirectAtEndOfJourney', 'true')
    })

    it('should redisplay page with API error message when goal completion fails', async () => {
      // Given
      req.body = { notes: 'Great progress made' }
      const expectedCompleteGoalDto = { goalReference, prisonNumber, note: 'Great progress made', prisonId }

      educationAndWorkPlanService.completeGoal.mockRejectedValue(new Error('Service failure'))

      // When
      await controller.submitCompleteGoalForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('complete')
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
      expect(educationAndWorkPlanService.completeGoal).toHaveBeenCalledWith(expectedCompleteGoalDto, username)
      expect(res.redirectWithSuccess).not.toHaveBeenCalled()
      expect(auditService.logCompleteGoal).not.toHaveBeenCalled()
    })
  })
})
