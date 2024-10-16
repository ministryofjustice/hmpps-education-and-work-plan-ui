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
import { getPrisonerContext } from '../../data/session/prisonerContexts'

export default class ArchiveGoalController {
  constructor(
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
    private readonly auditService: AuditService,
  ) {}

  getArchiveGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary } = res.locals

    let { archiveGoalForm } = getPrisonerContext(req.session, prisonNumber)
    if (!archiveGoalForm || archiveGoalForm.reference !== goalReference) {
      const actionPlan = await this.educationAndWorkPlanService.getActionPlan(prisonNumber, req.user.username)
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

    getPrisonerContext(req.session, prisonNumber).archiveGoalForm = undefined

    const view = new ArchiveGoalView(prisonerSummary, archiveGoalForm)
    return res.render('pages/goal/archive/reason', { ...view.renderArgs })
  }

  submitArchiveGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const archiveGoalForm: ArchiveGoalForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).archiveGoalForm = archiveGoalForm

    const errors = validateArchiveGoalForm(archiveGoalForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/plan/${prisonNumber}/goals/${goalReference}/archive`, errors)
    }

    return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/archive/review`)
  }

  getReviewArchiveGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary } = res.locals
    const { archiveGoalForm } = getPrisonerContext(req.session, prisonNumber)
    if (!archiveGoalForm) {
      return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/archive`)
    }
    const view = new ReviewArchiveGoalView(prisonerSummary, archiveGoalForm)
    return res.render('pages/goal/archive/review', { ...view.renderArgs })
  }

  submitReviewArchiveGoal: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { archiveGoalForm } = getPrisonerContext(req.session, prisonNumber)
    getPrisonerContext(req.session, prisonNumber).archiveGoalForm = undefined

    const archiveGoalDto = toArchiveGoalDto(prisonNumber, archiveGoalForm)
    try {
      await this.educationAndWorkPlanService.archiveGoal(archiveGoalDto, req.user.token)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return next(createError(500, `Error archiving goal for prisoner ${prisonNumber}`))
    }

    this.auditService.logArchiveGoal(archiveGoalAuditData(req)) // no need to wait for response
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
