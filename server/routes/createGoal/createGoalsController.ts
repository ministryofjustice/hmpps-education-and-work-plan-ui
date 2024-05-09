import createError from 'http-errors'
import type { RequestHandler } from 'express'
import CreateGoalsView from './createGoalsView'
import toCreateGoalDtos from '../../data/mappers/createGoalDtoMapper'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import {
  CreateGoalFormAction,
  CreateGoalsForm,
  GoalCompleteDateOptions,
  PartialCreateGoalsForm,
} from './validators/GoalForm'

export default class CreateGoalsController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {}

  getCreateGoalsView: RequestHandler = async (req, res): Promise<void> => {
    const { prisonerSummary } = req.session

    const view = new CreateGoalsView(prisonerSummary, GoalCompleteDateOptions)
    return res.render('pages/createGoals/index', { ...view.renderArgs })
  }

  submitAction: RequestHandler = async (req, res) => {
    const { action, prisonNumber } = req.params
    const goalNumber = +req.query.goalNumber
    const stepNumber = +req.query.stepNumber
    const createGoalsForm = req.body as PartialCreateGoalsForm

    // Handle any non-submit form actions (eg: removal or addition of steps or goals)
    let fieldID = ''
    let updatedForm = createGoalsForm
    if (action === CreateGoalFormAction.REMOVE_STEP) {
      const result = handleRemoveStep(createGoalsForm, goalNumber, stepNumber)
      if (result) {
        updatedForm = result
        fieldID = `#goals-${goalNumber}-steps-${updatedForm.goals[goalNumber].steps.length - 1}-title`
      }
    } else if (action === CreateGoalFormAction.REMOVE_GOAL) {
      const result = handleRemoveGoal(createGoalsForm, goalNumber)
      if (result) {
        updatedForm = result
        fieldID = `#goals-${goalNumber}-title`
      }
    } else if (action === CreateGoalFormAction.ADD_STEP) {
      const result = handleAddAnotherStep(createGoalsForm, goalNumber)
      if (result) {
        updatedForm = result
        fieldID = `#goals-${goalNumber}-steps-${updatedForm.goals[goalNumber].steps.length - 1}-title`
      }
    } else if (action === CreateGoalFormAction.ADD_GOAL) {
      const result = handleAddAnotherGoal(createGoalsForm)
      if (result) {
        updatedForm = result
        fieldID = `#goals-${updatedForm.goals.length - 1}-title`
      }
    }

    req.flash('formValues', JSON.stringify(updatedForm))
    return res.redirect(`/plan/${prisonNumber}/goals/create${fieldID}`)
  }

  submitCreateGoalsForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    const { prisonId } = prisonerSummary
    const createGoalsForm = { ...req.body } as CreateGoalsForm

    try {
      const createGoalDtos = toCreateGoalDtos(createGoalsForm, prisonNumber, prisonId)
      await this.educationAndWorkPlanService.createGoals(createGoalDtos, req.user.token)
    } catch (e) {
      return next(createError(500, `Error creating goal(s) for prisoner ${prisonNumber}`, e))
    }

    return res.redirectWithSuccess(`/plan/${prisonNumber}/view/overview`, 'Goals added')
  }
}

const emptyGoal = () => ({
  title: '',
  steps: [emptyStep()],
})

const emptyStep = () => ({
  title: '',
})

const handleRemoveStep = (
  goalsForm: PartialCreateGoalsForm,
  goalNumber: number,
  stepNumber: number,
): PartialCreateGoalsForm => {
  const updatedGoalsForm = { ...goalsForm }

  if (Number.isNaN(goalNumber) || goalNumber < 0 || goalNumber >= updatedGoalsForm.goals.length) return null
  const goal = updatedGoalsForm.goals[goalNumber]

  if (Number.isNaN(stepNumber) || stepNumber < 0 || stepNumber > goal.steps.length - 1) return null
  goal.steps = [...goal.steps.slice(0, stepNumber), ...goal.steps.slice(stepNumber + 1)]

  return updatedGoalsForm
}

const handleRemoveGoal = (goalsForm: PartialCreateGoalsForm, goalNumber: number): PartialCreateGoalsForm => {
  const updatedGoalsForm = { ...goalsForm }

  if (Number.isNaN(goalNumber) || goalNumber < 0 || goalNumber >= updatedGoalsForm.goals.length) return null

  updatedGoalsForm.goals = [
    ...updatedGoalsForm.goals.slice(0, goalNumber),
    ...updatedGoalsForm.goals.slice(goalNumber + 1),
  ]

  return updatedGoalsForm
}

const handleAddAnotherStep = (goalsForm: PartialCreateGoalsForm, goalNumber: number): PartialCreateGoalsForm => {
  const updatedGoalsForm = { ...goalsForm }

  if (Number.isNaN(goalNumber) || goalNumber < 0 || goalNumber >= updatedGoalsForm.goals.length) return null
  const goal = updatedGoalsForm.goals[goalNumber]

  goal.steps = [...goal.steps, emptyStep()]
  updatedGoalsForm.goals[goalNumber] = goal

  return updatedGoalsForm
}

const handleAddAnotherGoal = (goalsForm: PartialCreateGoalsForm): PartialCreateGoalsForm => {
  return {
    ...goalsForm,
    goals: [...goalsForm.goals, emptyGoal()],
  }
}
