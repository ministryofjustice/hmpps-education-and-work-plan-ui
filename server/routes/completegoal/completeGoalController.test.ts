import { Request, Response } from 'express'
import createError from 'http-errors'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import AuditService, { BaseAuditData } from '../../services/auditService'
import toCompleteGoalDto from './mappers/completeGoalFormToDtoMapper'
import CompleteGoalController from './completeGoalController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

jest.mock('../../services/educationAndWorkPlanService')
jest.mock('../../services/auditService')
jest.mock('./mappers/completeGoalFormToDtoMapper')

describe('CompleteGoalController - submitCompleteGoalForm', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new CompleteGoalController(educationAndWorkPlanService, auditService)

  const prisonNumber = 'A1234GC'
  const username = 'a-dps-user'
  const goalReference = '1a2eae63-8102-4155-97cb-43d8fb739caf'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber, 'BXI')
  const requestId = 'deff305c-2460-4d07-853e-f8762a8a52c6'

  const req = {
    session: {},
    body: { note: 'Great progress made' },
    user: { token: 'some-token', username },
    params: { prisonNumber, goalReference },
    id: requestId,
  } as unknown as Request

  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    getPrisonerContext(req.session, prisonNumber).archiveGoalForm = undefined
    req.params.prisonNumber = prisonNumber
    req.params.goalReference = goalReference

    errors = []
  })

  it('should complete the goal and log the audit successfully', async () => {
    // Given
    const completeGoalDto = { prisonNumber, note: 'Great progress made' }
    ;(toCompleteGoalDto as jest.Mock).mockReturnValue(completeGoalDto)
    // When
    await controller.submitCompleteGoalForm(req as Request, res as Response, next)
    const expectedBaseAuditData: BaseAuditData = {
      correlationId: requestId,
      details: { goalReference },
      subjectId: prisonNumber,
      subjectType: 'PRISONER_ID',
      who: username,
    }
    // Then
    expect(toCompleteGoalDto).toHaveBeenCalledWith(prisonNumber, { note: 'Great progress made' })
    expect(auditService.logCompleteGoal).toHaveBeenCalledWith(expectedBaseAuditData)
    expect(res.redirectWithSuccess).toHaveBeenCalledWith('/plan/A1234GC/view/overview', 'Goal Completed')
    expect(next).not.toHaveBeenCalled()
  })

  it('should call next with a 500 error when goal completion fails', async () => {
    // Given
    const completeGoalDto = { prisonNumber, note: 'Great progress made' }
    ;(toCompleteGoalDto as jest.Mock).mockReturnValue(completeGoalDto)
    // When
    educationAndWorkPlanService.completeGoal.mockRejectedValue(new Error('Service failure'))
    await controller.submitCompleteGoalForm(req as Request, res as Response, next)
    // Then
    expect(next).toHaveBeenCalledWith(createError(500, 'Error completing goal for prisoner A1234GC'))
    expect(res.redirectWithSuccess).not.toHaveBeenCalled()
    expect(auditService.logCompleteGoal).not.toHaveBeenCalled()
  })
})
