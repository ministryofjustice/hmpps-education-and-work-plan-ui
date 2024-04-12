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
      goals: [emptyGoal()],
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

    // Handle the removal of steps before any validation, otherwise it would be impossible to remove an empty step
    if (createGoalsForm.action.startsWith('remove-step')) {
      const formActionParameters = createGoalsForm.action.split('|')
      const goalNumber = parseInt(formActionParameters[1], 10)
      const stepNumber = parseInt(formActionParameters[2], 10)

      const validGoalNumber =
        !Number.isNaN(goalNumber) && goalNumber >= 0 && goalNumber <= createGoalsForm.goals.length - 1
      const validStepNumber =
        validGoalNumber &&
        !Number.isNaN(stepNumber) &&
        stepNumber >= 0 &&
        stepNumber <= createGoalsForm.goals[goalNumber].steps.length - 1
      if (!validGoalNumber || !validStepNumber) {
        // An invalid goalNumber or stepNumber was passed on the form action. Do nothing; redisplay the form.
        logger.warn(`Invalid request to remove a step with form action field 'action: "${createGoalsForm.action}"'`)
        return res.redirect(`/plan/${prisonNumber}/goals/create`)
      }

      createGoalsForm.goals[goalNumber].steps.splice(stepNumber, 1)
      req.session.createGoalsForm = createGoalsForm

      const lastStepTitleFieldId = `goals[${goalNumber}].steps[${createGoalsForm.goals[goalNumber].steps.length - 1}].title`
      return res.redirect(`/plan/${prisonNumber}/goals/create#${lastStepTitleFieldId}`)
    }

    const errors = validateCreateGoalsForm(createGoalsForm)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/plan/${prisonNumber}/goals/create`)
    }

    if (createGoalsForm.action.startsWith('add-another-step')) {
      const formActionParameters = createGoalsForm.action.split('|')
      const goalNumber = parseInt(formActionParameters[1], 10)

      const validGoalNumber =
        !Number.isNaN(goalNumber) && goalNumber >= 0 && goalNumber <= createGoalsForm.goals.length - 1

      if (!validGoalNumber) {
        // An invalid goalNumber was passed on the form action. Do nothing; redisplay the form.
        logger.warn(
          `Invalid request to add a step to a goal with form action field 'action: "${createGoalsForm.action}"'`,
        )
        return res.redirect(`/plan/${prisonNumber}/goals/create`)
      }

      createGoalsForm.goals[goalNumber].steps.push(emptyStep())
      req.session.createGoalsForm = createGoalsForm

      const newStepTitleFieldId = `goals[${goalNumber}].steps[${
        createGoalsForm.goals[goalNumber].steps.length - 1
      }].title`
      return res.redirect(`/plan/${prisonNumber}/goals/create#${newStepTitleFieldId}`)
    }

    if (createGoalsForm.action === 'add-another-goal') {
      createGoalsForm.goals.push(emptyGoal())
      req.session.createGoalsForm = createGoalsForm

      const newGoalTitleFieldId = `goals[${createGoalsForm.goals.length - 1}].title`
      return res.redirect(`/plan/${prisonNumber}/goals/create#${newGoalTitleFieldId}`)
    }

    try {
      const createGoalDtos = toCreateGoalDtos(createGoalsForm, prisonId)
      await this.educationAndWorkPlanService.createGoals(createGoalDtos, req.user.token)

      req.session.createGoalsForm = undefined
      req.flash('goalsSuccessfullyCreated', 'true')
      return res.redirect(`/plan/${prisonNumber}/view/overview`)
    } catch (e) {
      logger.error(`Error creating goal(s) for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error creating goal(s) for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}

const emptyGoal = () => {
  return {
    title: '',
    steps: [emptyStep()],
  }
}

const emptyStep = () => {
  return { title: '' }
}
