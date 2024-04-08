import createError from 'http-errors'
import type { RequestHandler } from 'express'
import { startOfToday } from 'date-fns'
import type { CreateGoalsForm } from 'forms'
import logger from '../../../logger'
import CreateGoalsView from './createGoalsView'
import futureGoalTargetDateCalculator from '../futureGoalTargetDateCalculator'
import validateCreateGoalsForm from './createGoalsFormValidator'
import toCreateGoalDtos from '../../data/mappers/createGoalDtoMapper'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'

export default class CreateGoalsController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {}

  getCreateGoalsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const createGoalsForm = req.session.createGoalsForm || {
      prisonNumber,
      goals: [
        {
          title: '',
          steps: [{ title: '' }],
        },
      ],
    }
    req.session.createGoalsForm = undefined

    const today = startOfToday()
    const futureGoalTargetDates = [
      futureGoalTargetDateCalculator(today, 3),
      futureGoalTargetDateCalculator(today, 6),
      futureGoalTargetDateCalculator(today, 12),
    ]

    const view = new CreateGoalsView(prisonerSummary, createGoalsForm, futureGoalTargetDates, req.flash('errors'))
    return res.render('pages/createGoals/index', { ...view.renderArgs })
  }

  submitCreateGoalsForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    const { prisonId } = prisonerSummary

    const createGoalsForm = { ...req.body } as CreateGoalsForm
    if (!createGoalsForm.goals) {
      createGoalsForm.goals = []
    }
    createGoalsForm.goals.forEach((goal, goalIndex) => {
      if (!goal.steps) {
        createGoalsForm.goals[goalIndex].steps = []
      }
    })
    req.session.createGoalsForm = createGoalsForm

    const errors = validateCreateGoalsForm(createGoalsForm)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/plan/${prisonNumber}/goals/create`)
    }

    if (createGoalsForm.action.startsWith('add-another-step')) {
      const formActionParameters = createGoalsForm.action.split('|')
      const goalNumber = parseInt(formActionParameters[1], 10)

      createGoalsForm.goals[goalNumber].steps.push({ title: '' })
      req.session.createGoalsForm = createGoalsForm
      return res.redirect(`/plan/${prisonNumber}/goals/create`)
    }

    try {
      const createGoalDtos = toCreateGoalDtos(createGoalsForm, prisonId)
      await this.educationAndWorkPlanService.createGoals(createGoalDtos, req.user.token)

      req.session.createGoalsForm = undefined
      return res.redirect(`/plan/${prisonNumber}/view/overview`)
    } catch (e) {
      logger.error(`Error creating goal(s) for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error creating goal(s) for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
