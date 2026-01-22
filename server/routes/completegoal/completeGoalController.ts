import type { CompleteGoalDto } from 'dto'
import type { Request, RequestHandler } from 'express'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import { AuditService } from '../../services'
import { BaseAuditData } from '../../services/auditService'
import { Result } from '../../utils/result/result'
import logger from '../../../logger'
import {
  clearRedirectPendingFlag,
  setRedirectPendingFlag,
} from '../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

export default class CompleteGoalController {
  constructor(
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
    private readonly auditService: AuditService,
  ) {}

  getCompleteGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, goal } = res.locals

    clearRedirectPendingFlag(req)

    return res.render('pages/goal/complete/index', { prisonerSummary, goal, form: { notes: '' } })
  }

  submitCompleteGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary } = res.locals
    const completeGoalForm = { ...req.body }

    const { prisonId } = prisonerSummary
    const completeGoalDto = toCompleteGoalDto(prisonNumber, goalReference, prisonId, completeGoalForm)

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.educationAndWorkPlanService.completeGoal(completeGoalDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error completing goal for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('complete')
    }

    this.auditService.logCompleteGoal(completeGoalAuditData(req)) // no need to wait for response
    setRedirectPendingFlag(req)
    return res.redirectWithSuccess(`/plan/${prisonNumber}/view/overview`, 'Goal Completed')
  }
}

const completeGoalAuditData = (req: Request): BaseAuditData => {
  const { prisonNumber, goalReference } = req.params
  return {
    details: { goalReference },
    subjectType: 'PRISONER_ID',
    subjectId: prisonNumber,
    who: req.user?.username ?? 'UNKNOWN',
    correlationId: req.id,
  }
}

const toCompleteGoalDto = (
  prisonNumber: string,
  goalReference: string,
  prisonId: string,
  form: { notes?: string },
): CompleteGoalDto => ({
  goalReference,
  prisonNumber,
  note: form.notes?.trim() || null,
  prisonId,
})
