import { Request, Response } from 'express'
import createError from 'http-errors'
import type { UnarchiveGoalDto } from 'dto'
import UnarchiveGoalController from './unarchiveGoalController'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import AuditService, { BaseAuditData } from '../../services/auditService'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'
import { Result } from '../../utils/result/result'

jest.mock('../../services/educationAndWorkPlanService')
jest.mock('../../services/auditService')

describe('unarchiveGoalController', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new UnarchiveGoalController(educationAndWorkPlanService, auditService)

  const prisonNumber = 'A1234BC'
  const prisonId = 'BXI'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber, prisonId })
  const goalReference = '1a2eae63-8102-4155-97cb-43d8fb739caf'
  const goal = Result.fulfilled(aValidGoal({ goalReference }))

  const requestId = 'deff305c-2460-4d07-853e-f8762a8a52c6'

  const flash = jest.fn()
  const req = {
    session: {},
    body: {},
    user: { username },
    params: { prisonNumber, goalReference },
    id: requestId,
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary, goal },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getUnarchiveGoalView', () => {
    it('should get the unarchived goal view', async () => {
      // Given
      const expectedView = {
        prisonerSummary,
        goal,
      }

      // When
      await controller.getUnarchiveGoalView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/unarchive/index', expectedView)
    })
  })

  describe('submitUnarchiveGoalForm', () => {
    it('should unarchive goal and redirect to Overview page', async () => {
      // Given
      const expectedUnarchiveGoalDto: UnarchiveGoalDto = {
        goalReference,
        prisonNumber,
        prisonId,
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
      expect(educationAndWorkPlanService.unarchiveGoal).toHaveBeenCalledWith(expectedUnarchiveGoalDto, username)
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`, 'Goal reactivated')
      expect(auditService.logUnarchiveGoal).toHaveBeenCalledWith(expectedBaseAuditData)
      expect(flash).toHaveBeenCalledWith('pendingRedirectAtEndOfJourney', 'true')
    })

    it('should not unarchive goal given error calling service to unarchive the goal', async () => {
      // Given
      educationAndWorkPlanService.unarchiveGoal.mockRejectedValue(createError(500, 'Service unavailable'))

      const expectedUnarchiveGoalDto: UnarchiveGoalDto = {
        goalReference,
        prisonNumber,
        prisonId,
      }

      // When
      await controller.submitUnarchiveGoalForm(req, res, next)

      // Then
      expect(educationAndWorkPlanService.unarchiveGoal).toHaveBeenCalledWith(expectedUnarchiveGoalDto, username)
      expect(res.redirect).toHaveBeenCalledWith('unarchive')
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
      expect(auditService.logUnarchiveGoal).not.toHaveBeenCalled()
    })
  })
})
