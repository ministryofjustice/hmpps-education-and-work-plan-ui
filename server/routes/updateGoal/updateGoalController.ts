import type { RequestHandler } from 'express'
import type { UpdateGoalForm } from 'forms'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import UpdateGoalView from './updateGoalView'
import { toUpdateGoalForm } from './mappers/goalToUpdateGoalFormMapper'
import validateUpdateGoalForm from './updateGoalFormValidator'
import { toUpdateGoalDto } from './mappers/updateGoalFormToUpdateGoalDtoMapper'

export default class UpdateGoalController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {}

  getUpdateGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary } = req.session

    let updateGoalForm: UpdateGoalForm
    if (req.session.updateGoalForm) {
      updateGoalForm = req.session.updateGoalForm
    } else {
      const actionPlan = await this.educationAndWorkPlanService.getActionPlan(prisonNumber, req.user.token)
      if (actionPlan.problemRetrievingData) {
        // There was a problem retrieving the prisoner's action plan
        // TODO - RR-188
        res.redirect('/error')
        return
      }

      const goalToUpdate = actionPlan.goals.find(goal => goal.goalReference === goalReference)
      if (!goalToUpdate) {
        // The requested goal is not part of the prisoners action plan
        // TODO - RR-188
        res.redirect('/error')
        return
      }

      updateGoalForm = toUpdateGoalForm(goalToUpdate)
    }

    req.session.updateGoalForm = undefined

    const view = new UpdateGoalView(prisonerSummary, updateGoalForm, req.flash('errors'))
    res.render('pages/goal/update/index', { ...view.renderArgs })
  }

  submitUpdateGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const updateGoalForm = { ...req.body }

    const errors = validateUpdateGoalForm(updateGoalForm)
    if (errors.length > 0) {
      req.flash('errors', errors)
      req.session.updateGoalForm = updateGoalForm
      return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/update`)
    }

    const updateGoalDto = toUpdateGoalDto(updateGoalForm)
    await this.educationAndWorkPlanService.updateGoal(prisonNumber, updateGoalDto, req.user.token)
    // TODO - RR-188 - handle API error response when updating goal

    return res.redirect(`/plan/${prisonNumber}/view/overview`)
  }
}
