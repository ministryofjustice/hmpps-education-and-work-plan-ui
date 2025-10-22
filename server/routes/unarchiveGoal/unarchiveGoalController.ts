import type { Request, RequestHandler } from 'express'
import createError from 'http-errors'
import type { UnarchiveGoalForm } from 'forms'
import type { Goal } from 'viewModels'
import UnarchiveGoalView from './unarchiveGoalView'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import toUnarchiveGoalDto from './mappers/unarchiveGoalFormToDtoMapper'
import { AuditService } from '../../services'
import { BaseAuditData } from '../../services/auditService'
import { Result } from '../../utils/result/result'
import logger from '../../../logger'

export default class UnarchiveGoalController {
  constructor(
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
    private readonly auditService: AuditService,
  ) {}

  getUnarchiveGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary, goals } = res.locals

    if (goals.problemRetrievingData) {
      return next(createError(500, `Error retrieving plan for prisoner ${prisonNumber}`))
    }

    const goalToUnarchive = (goals.goals as Array<Goal>).find(goal => goal.goalReference === goalReference)
    if (!goalToUnarchive) {
      return next(createError(404, `Archived goal ${goalReference} does not exist in the prisoner's plan`))
    }

    const unarchiveGoalForm: UnarchiveGoalForm = {
      reference: goalReference,
      title: goalToUnarchive.title,
    }

    const view = new UnarchiveGoalView(prisonerSummary, unarchiveGoalForm)
    return res.render('pages/goal/unarchive/index', { ...view.renderArgs })
  }

  submitUnarchiveGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const unarchiveGoalForm: UnarchiveGoalForm = { ...req.body }

    const { prisonId } = prisonerSummary
    const unarchiveGoalDto = toUnarchiveGoalDto(prisonNumber, prisonId, unarchiveGoalForm)

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
