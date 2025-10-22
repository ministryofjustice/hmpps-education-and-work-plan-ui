import type { Request, RequestHandler } from 'express'
import createError from 'http-errors'
import type { CompleteGoalForm } from 'forms'
import type { Goal } from 'viewModels'
import CompleteGoalView from './completeGoalView'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import toCompleteGoalDto from './mappers/completeGoalFormToDtoMapper'
import { AuditService } from '../../services'
import { BaseAuditData } from '../../services/auditService'
import { Result } from '../../utils/result/result'
import logger from '../../../logger'

export default class CompleteGoalController {
  constructor(
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
    private readonly auditService: AuditService,
  ) {}

  getCompleteGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary, goals } = res.locals

    if (goals.problemRetrievingData) {
      return next(createError(500, `Error retrieving plan for prisoner ${prisonNumber}`))
    }

    const goalToComplete = (goals.goals as Array<Goal>).find(goal => goal.goalReference === goalReference)
    if (!goalToComplete) {
      return next(createError(404, `Active goal ${goalReference} does not exist in the prisoner's plan`))
    }

    const completeGoalForm: CompleteGoalForm = {
      reference: goalReference,
      title: goalToComplete.title,
      notes: '',
    }

    const view = new CompleteGoalView(prisonerSummary, completeGoalForm)
    return res.render('pages/goal/complete/index', { ...view.renderArgs })
  }

  submitCompleteGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const completeGoalForm: CompleteGoalForm = { ...req.body }

    const { prisonId } = prisonerSummary
    const completeGoalDto = toCompleteGoalDto(prisonNumber, prisonId, completeGoalForm)

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
