import type { RequestHandler, Request } from 'express'
import type { ArchiveGoalForm } from 'forms'
import createError from 'http-errors'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import ArchiveGoalView from './archiveGoalView'
import validateArchiveGoalForm from './archiveGoalFormValidator'
import ReviewArchiveGoalView from './reviewArchiveGoalView'
import toArchiveGoalDto from './mappers/archiveGoalFormToDtoMapper'
import { AuditService } from '../../services'
import { BaseAuditData } from '../../services/auditService'

export default class ArchiveGoalController {
  constructor(
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
    private readonly auditService: AuditService,
  ) {}

  getArchiveGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary } = req.session

    let archiveGoalForm: ArchiveGoalForm
    if (req.session.archiveGoalForm && req.session.archiveGoalForm.reference === goalReference) {
      archiveGoalForm = req.session.archiveGoalForm
    } else {
      const actionPlan = await this.educationAndWorkPlanService.getActionPlan(prisonNumber, req.user.token)
      if (actionPlan.problemRetrievingData) {
        return next(createError(500, `Error retrieving plan for prisoner ${prisonNumber}`))
      }

      const goalToArchive = actionPlan.goals.find(goal => goal.goalReference === goalReference)
      if (!goalToArchive) {
        return next(createError(404, `Goal ${goalReference} does not exist in the prisoner's plan`))
      }

      archiveGoalForm = {
        reference: goalReference,
        title: goalToArchive.title,
      }
    }

    req.session.archiveGoalForm = undefined

    const view = new ArchiveGoalView(prisonerSummary, archiveGoalForm)
    return res.render('pages/goal/archive/reason', { ...view.renderArgs })
  }

  submitArchiveGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const archiveGoalForm: ArchiveGoalForm = { ...req.body }
    req.session.archiveGoalForm = archiveGoalForm

    const errors = validateArchiveGoalForm(archiveGoalForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/plan/${prisonNumber}/goals/${goalReference}/archive`, errors)
    }

    return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/archive/review`)
  }

  getReviewArchiveGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary } = req.session
    const { archiveGoalForm } = req.session
    if (!archiveGoalForm) {
      return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/archive`)
    }
    const view = new ReviewArchiveGoalView(prisonerSummary, archiveGoalForm)
    return res.render('pages/goal/archive/review', { ...view.renderArgs })
  }

  submitReviewArchiveGoal: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { archiveGoalForm } = req.session
    req.session.archiveGoalForm = undefined

    const archiveGoalDto = toArchiveGoalDto(prisonNumber, archiveGoalForm)
    try {
      await this.educationAndWorkPlanService.archiveGoal(archiveGoalDto, req.user.token)
    } catch (e) {
      return next(createError(500, `Error archiving goal for prisoner ${prisonNumber}`))
    }

    this.auditService.logArchiveGoal(archiveGoalAuditData(req)) // no need to wait for response
    return res.redirectWithSuccess(`/plan/${prisonNumber}/view/overview`, 'Goal archived')
  }

  cancelArchiveGoal: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.archiveGoalForm = undefined
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
