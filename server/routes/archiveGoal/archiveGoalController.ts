import type { RequestHandler, Request } from 'express'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import toArchiveGoalDto from './mappers/archiveGoalFormToDtoMapper'
import { AuditService } from '../../services'
import { BaseAuditData } from '../../services/auditService'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import { Result } from '../../utils/result/result'
import logger from '../../../logger'
import {
  clearRedirectPendingFlag,
  setRedirectPendingFlag,
} from '../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

export default class ArchiveGoalController {
  constructor(
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
    private readonly auditService: AuditService,
  ) {}

  getArchiveGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, goal, invalidForm } = res.locals

    const archiveGoalForm = invalidForm ?? (getPrisonerContext(req.session, prisonNumber).archiveGoalForm || {})

    getPrisonerContext(req.session, prisonNumber).archiveGoalForm = undefined

    return res.render('pages/goal/archive/reason', { prisonerSummary, goal, archiveGoalForm })
  }

  submitArchiveGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const archiveGoalForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).archiveGoalForm = archiveGoalForm

    return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/archive/review`)
  }

  getReviewArchiveGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary } = res.locals

    clearRedirectPendingFlag(req)

    const { archiveGoalForm } = getPrisonerContext(req.session, prisonNumber)
    if (!archiveGoalForm) {
      return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/archive`)
    }

    return res.render('pages/goal/archive/review', { prisonerSummary, form: archiveGoalForm })
  }

  submitReviewArchiveGoal: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { archiveGoalForm } = getPrisonerContext(req.session, prisonNumber)

    const { prisonId } = prisonerSummary
    const archiveGoalDto = toArchiveGoalDto(prisonNumber, prisonId, archiveGoalForm)

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.educationAndWorkPlanService.archiveGoal(archiveGoalDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error archiving goal for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('review')
    }

    getPrisonerContext(req.session, prisonNumber).archiveGoalForm = undefined
    this.auditService.logArchiveGoal(archiveGoalAuditData(req)) // no need to wait for response
    setRedirectPendingFlag(req)
    return res.redirectWithSuccess(`/plan/${prisonNumber}/view/overview`, 'Goal archived')
  }

  cancelArchiveGoal: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    getPrisonerContext(req.session, prisonNumber).archiveGoalForm = undefined
    return res.redirect(`/plan/${prisonNumber}/view/overview`)
  }
}

const archiveGoalAuditData = (req: Request): BaseAuditData => {
  const { prisonNumber, goalReference } = req.params
  return {
    details: { goalReference },
    subjectType: 'PRISONER_ID',
    subjectId: prisonNumber,
    who: req.user?.username ?? 'UNKNOWN',
    correlationId: req.id,
  }
}
