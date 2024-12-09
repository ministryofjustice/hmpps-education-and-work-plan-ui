import type { Request, RequestHandler } from 'express'
import createError from 'http-errors'
import type { CompleteGoalForm } from 'forms'
import type { Goal } from 'viewModels'
import CompleteGoalView from './completeGoalView'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import toCompleteGoalDto from './mappers/completeGoalFormToDtoMapper'
import { AuditService } from '../../services'
import { BaseAuditData } from '../../services/auditService'

export default class CompleteGoalController {
  constructor(
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
    private readonly auditService: AuditService,
  ) {}

  getCompleteGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary, allGoalsForPrisoner } = res.locals

    if (allGoalsForPrisoner.problemRetrievingData) {
      return next(createError(500, `Error retrieving plan for prisoner ${prisonNumber}`))
    }

    const goalToComplete = (allGoalsForPrisoner.goals.ACTIVE as Array<Goal>).find(
      goal => goal.goalReference === goalReference,
    )
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
    const completeGoalForm: CompleteGoalForm = { ...req.body }

    const completeGoalDto = toCompleteGoalDto(prisonNumber, completeGoalForm)
    try {
      await this.educationAndWorkPlanService.completeGoal(completeGoalDto, req.user.token)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return next(createError(500, `Error completing goal for prisoner ${prisonNumber}`))
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
