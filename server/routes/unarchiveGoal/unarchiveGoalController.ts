import type { Request, RequestHandler } from 'express'
import createError from 'http-errors'
import type { UnarchiveGoalForm } from 'forms'
import UnarchiveGoalView from './unarchiveGoalView'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import toUnarchiveGoalDto from './mappers/unarchiveGoalFormToDtoMapper'
import { AuditService } from '../../services'
import { BaseAuditData } from '../../services/auditService'

export default class UnarchiveGoalController {
  constructor(
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
    private readonly auditService: AuditService,
  ) {}

  getUnarchiveGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary } = req.session

    const actionPlan = await this.educationAndWorkPlanService.getActionPlan(prisonNumber, req.user.username)
    if (actionPlan.problemRetrievingData) {
      return next(createError(500, `Error retrieving plan for prisoner ${prisonNumber}`))
    }

    const goalToUnarchive = actionPlan.goals.find(goal => goal.goalReference === goalReference)
    if (!goalToUnarchive) {
      return next(createError(404, `Goal ${goalReference} does not exist in the prisoner's plan`))
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
    const unarchiveGoalForm: UnarchiveGoalForm = { ...req.body }

    const unarchiveGoalDto = toUnarchiveGoalDto(prisonNumber, unarchiveGoalForm)
    try {
      await this.educationAndWorkPlanService.unarchiveGoal(unarchiveGoalDto, req.user.token)
    } catch (e) {
      return next(createError(500, `Error unarchiving goal for prisoner ${prisonNumber}`))
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
