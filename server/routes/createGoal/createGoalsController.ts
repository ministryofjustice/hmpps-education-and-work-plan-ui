import createError from 'http-errors'
import type { RequestHandler } from 'express'
import type { CreateGoalsForm } from 'forms'
import logger from '../../../logger'
import CreateGoalsView from './createGoalsView'
import validateCreateGoalsForm from './createGoalsFormValidator'
import toCreateGoalDtos from '../../data/mappers/createGoalDtoMapper'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import GoalTargetCompletionDateOption from '../../enums/goalTargetCompletionDateOption'

export default class CreateGoalsController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {}

  getCreateGoalsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = req.session

    const { createGoalsForm } = req.session
    req.session.createGoalsForm = undefined

    const view = new CreateGoalsView(prisonerSummary, createGoalsForm, GoalTargetCompletionDateOption)
    return res.render('pages/createGoals/index', { ...view.renderArgs })
  }

  submitAction: RequestHandler = async (req, res): Promise<void> => {
    const { prisonNumber, action } = req.params
    const goalNumber = parseInt(req.query.goalNumber as string, 10)
    const stepNumber = parseInt(req.query.stepNumber as string, 10)
    const createGoalsForm = { ...req.body } as CreateGoalsForm

    let updatedForm: CreateGoalsForm
    let fieldID = ''

    if (action === 'REMOVE_STEP') {
      updatedForm = handleRemoveStep(createGoalsForm, goalNumber, stepNumber)
      const stepCount = updatedForm?.goals?.[goalNumber]?.steps?.length
      fieldID = `#goals[${goalNumber}].steps[${stepCount - 1}].title`
    } else if (action === 'REMOVE_GOAL') {
      updatedForm = handleRemoveGoal(createGoalsForm, goalNumber)
      const goalCount = updatedForm?.goals?.length
      const stepCount = updatedForm?.goals?.[goalNumber]?.steps?.length
      fieldID = `#goals[${goalCount - 1}].steps[${stepCount - 1}].title`
    } else if (action === 'ADD_STEP') {
      updatedForm = handleAddAnotherStep(createGoalsForm, goalNumber)
      const stepCount = updatedForm?.goals?.[goalNumber]?.steps?.length
      fieldID = `#goals[${goalNumber}].steps[${stepCount - 1}].title`
    } else if (action === 'ADD_GOAL') {
      updatedForm = handleAddAnotherGoal(createGoalsForm)
      const goalCount = updatedForm?.goals?.length
      fieldID = `#goals[${goalCount - 1}].title`
    }

    if (updatedForm) {
      req.session.createGoalsForm = updatedForm
      return res.redirect(`/plan/${prisonNumber}/goals/create${fieldID}`)
    }

    req.session.createGoalsForm = createGoalsForm
    return res.redirect(`/plan/${prisonNumber}/goals/create`)
  }

  submitCreateGoalsForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    const { prisonId } = prisonerSummary

    const createGoalsForm = { ...req.body } as CreateGoalsForm
    req.session.createGoalsForm = createGoalsForm

    const errors = validateCreateGoalsForm(createGoalsForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/plan/${prisonNumber}/goals/create`, errors)
    }

    try {
      const createGoalDtos = toCreateGoalDtos(createGoalsForm, prisonId)
      await this.educationAndWorkPlanService.createGoals(createGoalDtos, req.user.token)

      req.session.createGoalsForm = undefined
      return res.redirectWithSuccess(`/plan/${prisonNumber}/view/overview`, 'Goals added')
    } catch (e) {
      logger.error(`Error creating goal(s) for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error creating goal(s) for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}

const emptyGoal = () => ({
  title: '',
  steps: [emptyStep()],
})

const emptyStep = () => ({ title: '' })

const handleRemoveStep = (
  createGoalsForm: CreateGoalsForm,
  goalNumber: number,
  stepNumber: number,
): CreateGoalsForm => {
  if (!createGoalsForm?.goals?.[goalNumber]?.steps?.[stepNumber]) return null

  const goalsForm = { ...createGoalsForm }
  goalsForm.goals[goalNumber].steps = [...goalsForm.goals[goalNumber].steps]
  goalsForm.goals[goalNumber].steps.splice(stepNumber, 1)

  return goalsForm
}

const handleRemoveGoal = (createGoalsForm: CreateGoalsForm, goalNumber: number): CreateGoalsForm => {
  if (!createGoalsForm?.goals?.[goalNumber]) return null

  const goalsForm = { ...createGoalsForm }
  goalsForm.goals = [...goalsForm.goals]
  goalsForm.goals.splice(goalNumber, 1)

  return goalsForm
}

const handleAddAnotherStep = (createGoalsForm: CreateGoalsForm, goalNumber: number): CreateGoalsForm => {
  if (!createGoalsForm?.goals?.[goalNumber]) return null

  const goalsForm = { ...createGoalsForm }
  goalsForm.goals[goalNumber].steps = [...goalsForm.goals[goalNumber].steps, emptyStep()]

  return goalsForm
}

const handleAddAnotherGoal = (createGoalsForm: CreateGoalsForm): CreateGoalsForm => {
  return {
    ...createGoalsForm,
    goals: [...createGoalsForm.goals, emptyGoal()],
  }
}
