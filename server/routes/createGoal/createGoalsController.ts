import createError from 'http-errors'
import type { Request, RequestHandler, Response } from 'express'
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

    // Handle any form actions (eg: removal or addition of steps or goals) before any validation
    if (createGoalsForm.action.startsWith('remove-step')) {
      return handleRemoveStep(createGoalsForm, prisonNumber, req, res)
    }
    if (createGoalsForm.action.startsWith('remove-goal')) {
      return handleRemoveGoal(createGoalsForm, prisonNumber, req, res)
    }
    if (createGoalsForm.action.startsWith('add-another-step')) {
      return handleAddAnotherStep(createGoalsForm, prisonNumber, req, res)
    }
    if (createGoalsForm.action === 'add-another-goal') {
      return handleAddAnotherGoal(createGoalsForm, prisonNumber, req, res)
    }

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

const emptyGoal = () => {
  return {
    title: '',
    steps: [emptyStep()],
  }
}

const emptyStep = () => {
  return { title: '' }
}

const handleRemoveStep = (
  createGoalsForm: CreateGoalsForm,
  prisonNumber: string,
  req: Request,
  res: Response,
): void => {
  const formActionParameters = createGoalsForm.action.split('|')
  const goalNumber = parseInt(formActionParameters[1], 10)
  const stepNumber = parseInt(formActionParameters[2], 10)

  const isValidGoalNumber =
    Number.isInteger(goalNumber) && goalNumber >= 0 && goalNumber <= createGoalsForm.goals.length - 1
  const isValidStepNumber =
    isValidGoalNumber &&
    Number.isInteger(stepNumber) &&
    stepNumber >= 0 &&
    stepNumber <= createGoalsForm.goals[goalNumber].steps.length - 1
  if (!isValidGoalNumber || !isValidStepNumber) {
    // An invalid goalNumber or stepNumber was passed on the form action. Do nothing; redisplay the form.
    logger.warn(`Invalid request to remove a step with form action field 'action: "${createGoalsForm.action}"'`)
    return res.redirect(`/plan/${prisonNumber}/goals/create`)
  }

  createGoalsForm.goals[goalNumber].steps.splice(stepNumber, 1)
  req.session.createGoalsForm = createGoalsForm

  const lastStepTitleFieldId = `goals[${goalNumber}].steps[${createGoalsForm.goals[goalNumber].steps.length - 1}].title`
  return res.redirect(`/plan/${prisonNumber}/goals/create#${lastStepTitleFieldId}`)
}

const handleRemoveGoal = (
  createGoalsForm: CreateGoalsForm,
  prisonNumber: string,
  req: Request,
  res: Response,
): void => {
  const formActionParameters = createGoalsForm.action.split('|')
  const goalNumber = parseInt(formActionParameters[1], 10)

  const isValidGoalNumber =
    Number.isInteger(goalNumber) && goalNumber >= 0 && goalNumber <= createGoalsForm.goals.length - 1
  if (!isValidGoalNumber) {
    // An invalid goalNumber was passed on the form action. Do nothing; redisplay the form.
    logger.warn(`Invalid request to remove a goal with form action field 'action: "${createGoalsForm.action}"'`)
    return res.redirect(`/plan/${prisonNumber}/goals/create`)
  }

  createGoalsForm.goals.splice(goalNumber, 1)
  req.session.createGoalsForm = createGoalsForm

  const lastGoalIndex = createGoalsForm.goals.length - 1
  const lastStepTitleFieldId = `goals[${lastGoalIndex}].steps[${createGoalsForm.goals[lastGoalIndex].steps.length - 1}].title`
  return res.redirect(`/plan/${prisonNumber}/goals/create#${lastStepTitleFieldId}`)
}

const handleAddAnotherStep = (
  createGoalsForm: CreateGoalsForm,
  prisonNumber: string,
  req: Request,
  res: Response,
): void => {
  const formActionParameters = createGoalsForm.action.split('|')
  const goalNumber = parseInt(formActionParameters[1], 10)

  const isValidGoalNumber =
    Number.isInteger(goalNumber) && goalNumber >= 0 && goalNumber <= createGoalsForm.goals.length - 1
  if (!isValidGoalNumber) {
    // An invalid goalNumber was passed on the form action. Do nothing; redisplay the form.
    logger.warn(`Invalid request to add a step to a goal with form action field 'action: "${createGoalsForm.action}"'`)
    return res.redirect(`/plan/${prisonNumber}/goals/create`)
  }

  createGoalsForm.goals[goalNumber].steps.push(emptyStep())
  req.session.createGoalsForm = createGoalsForm

  const newStepTitleFieldId = `goals[${goalNumber}].steps[${createGoalsForm.goals[goalNumber].steps.length - 1}].title`
  return res.redirect(`/plan/${prisonNumber}/goals/create#${newStepTitleFieldId}`)
}

const handleAddAnotherGoal = (
  createGoalsForm: CreateGoalsForm,
  prisonNumber: string,
  req: Request,
  res: Response,
): void => {
  createGoalsForm.goals.push(emptyGoal())
  req.session.createGoalsForm = createGoalsForm

  const lastGoalIndex = createGoalsForm.goals.length - 1
  const newGoalTitleFieldId = `goals[${lastGoalIndex}].title`
  return res.redirect(`/plan/${prisonNumber}/goals/create#${newGoalTitleFieldId}`)
}
