import type { Request, RequestHandler } from 'express'
import type { CreateGoalsForm } from 'forms'
import type { CreateActionPlanDto } from 'dto'
import logger from '../../../logger'
import CreateGoalsView from './createGoalsView'
import validateCreateGoalsForm from './createGoalsFormValidator'
import toCreateGoalDtos from '../../data/mappers/createGoalDtoMapper'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import GoalTargetCompletionDateOption from '../../enums/goalTargetCompletionDateOption'
import { AuditService } from '../../services'
import { BaseAuditData } from '../../services/auditService'
import { Result } from '../../utils/result/result'

export default class CreateGoalsController {
  constructor(
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
    private readonly auditService: AuditService,
  ) {}

  getCreateGoalsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = res.locals
    const { createGoalsForm } = req.journeyData

    const view = new CreateGoalsView(prisonerSummary, createGoalsForm, GoalTargetCompletionDateOption)
    return res.render('pages/createGoals/index', { ...view.renderArgs })
  }

  submitAction: RequestHandler = async (req, res): Promise<void> => {
    const { prisonNumber, journeyId, action } = req.params
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
      req.journeyData.createGoalsForm = updatedForm
      return res.redirect(`/plan/${prisonNumber}/goals/${journeyId}/create${fieldID}`)
    }

    req.journeyData.createGoalsForm = createGoalsForm
    return res.redirect(`/plan/${prisonNumber}/goals/${journeyId}/create`)
  }

  submitCreateGoalsForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { prisonerSummary, actionPlan } = res.locals
    const { prisonId } = prisonerSummary

    const createGoalsForm = { ...req.body } as CreateGoalsForm
    req.journeyData.createGoalsForm = createGoalsForm

    const errors = validateCreateGoalsForm(createGoalsForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/plan/${prisonNumber}/goals/${journeyId}/create`, errors)
    }

    const createGoalDtos = toCreateGoalDtos(createGoalsForm, prisonId)

    const { apiErrorCallback } = res.locals
    let apiResult
    if (actionPlan.goals.length > 0) {
      apiResult = await Result.wrap(
        this.educationAndWorkPlanService.createGoals(prisonNumber, createGoalDtos, req.user.username),
        apiErrorCallback,
      )
    } else {
      const createActionPlanDto: CreateActionPlanDto = {
        prisonNumber,
        goals: createGoalDtos,
      }
      apiResult = await Result.wrap(
        this.educationAndWorkPlanService.createActionPlan(createActionPlanDto, req.user.username),
        apiErrorCallback,
      )
    }
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error creating goal(s) for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('create')
    }

    createGoalDtos.forEach(
      (createGoalDto, idx) => this.auditService.logCreateGoal(createGoalAuditData(req, idx + 1, createGoalDtos.length)), // no need to wait for response
    )
    req.journeyData.createGoalsForm = undefined
    return res.redirectWithSuccess(`/plan/${prisonNumber}/view/overview`, 'Goals added')
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

const createGoalAuditData = (req: Request, goalIdx: number, totalGoalsCreatedInThisRequest: number): BaseAuditData => {
  return {
    details: {
      goalNumber: goalIdx,
      ofGoalsCreatedInThisRequest: totalGoalsCreatedInThisRequest,
    },
    subjectType: 'PRISONER_ID',
    subjectId: req.params.prisonNumber,
    who: req.user?.username ?? 'UNKNOWN',
    correlationId: req.id,
  }
}
