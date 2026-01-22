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

export default class UnarchiveGoalController {
  constructor(
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
    private readonly auditService: AuditService,
  ) {}

  getUnarchiveGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, goal } = res.locals

    clearRedirectPendingFlag(req)

    return res.render('pages/goal/unarchive/index', { prisonerSummary, goal })
  }

  submitUnarchiveGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary } = res.locals

    const { prisonId } = prisonerSummary
    const unarchiveGoalDto = {
      goalReference,
      prisonNumber,
      prisonId,
    }

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.educationAndWorkPlanService.unarchiveGoal(unarchiveGoalDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error unarchiving goal for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('unarchive')
    }

    this.auditService.logUnarchiveGoal(unarchiveGoalAuditData(req)) // no need to wait for response
    setRedirectPendingFlag(req)
    return res.redirectWithSuccess(`/plan/${prisonNumber}/view/overview`, 'Goal reactivated')
  }
}

const unarchiveGoalAuditData = (req: Request): BaseAuditData => {
  const { prisonNumber, goalReference } = req.params
  return {
    details: { goalReference },
    subjectType: 'PRISONER_ID',
    subjectId: prisonNumber,
    who: req.user?.username ?? 'UNKNOWN',
    correlationId: req.id,
  }
}
