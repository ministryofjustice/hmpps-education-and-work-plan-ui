import type { RequestHandler } from 'express'
import createError from 'http-errors'
import type { CompleteOrArchiveGoalForm } from 'forms'
import CompleteOrArchiveGoalView from './completeOrArchiveGoalView'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'

export default class CompleteOrArchiveGoalController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {}

  getCompleteOrArchiveGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary } = res.locals

    const actionPlan = await this.educationAndWorkPlanService.getActionPlan(prisonNumber, req.user.username)
    if (actionPlan.problemRetrievingData) {
      return next(createError(500, `Error retrieving plan for prisoner ${prisonNumber}`))
    }

    const goalToComplete = actionPlan.goals.find(goal => goal.goalReference === goalReference)
    if (!goalToComplete) {
      return next(createError(404, `Goal ${goalReference} does not exist in the prisoner's plan`))
    }

    const completeOrArchiveGoalForm: CompleteOrArchiveGoalForm = {
      reference: goalReference,
      title: goalToComplete.title,
      archiveOrComplete: '',
    }
    const view = new CompleteOrArchiveGoalView(prisonerSummary, completeOrArchiveGoalForm)
    return res.render('pages/goal/completeorarchive/index', { ...view.renderArgs })
  }

  submitCompleteOrArchiveGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const completeOrArchiveGoalForm: CompleteOrArchiveGoalForm = { ...req.body }
    if (completeOrArchiveGoalForm.archiveOrComplete === 'COMPLETE') {
      return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/complete`)
    }
    return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/archive`)
  }
}
