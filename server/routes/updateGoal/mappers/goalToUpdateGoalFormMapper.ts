import type { UpdateGoalForm, UpdateStepForm } from 'forms'
import type { Goal, Step } from 'viewModels'
import { format } from 'date-fns'
import GoalStatusValue from '../../../enums/goalStatusValue'
import StepStatusValue from '../../../enums/stepStatusValue'

const toUpdateGoalForm = (goal: Goal): UpdateGoalForm => {
  return {
    reference: goal.goalReference,
    title: goal.title,
    createdAt: goal.createdAt.toISOString(),
    targetCompletionDate: toDateString(goal.targetCompletionDate),
    'targetCompletionDate-day': null,
    'targetCompletionDate-month': null,
    'targetCompletionDate-year': null,
    note: goal.notesByType.GOAL.at(0)?.content,
    steps: goal.steps.map(step => toUpdateStepForm(step)),
    originalTargetCompletionDate: toDateString(goal.targetCompletionDate),
    status: GoalStatusValue[goal.status as keyof typeof GoalStatusValue],
  }
}

const toUpdateStepForm = (step: Step): UpdateStepForm => {
  return {
    reference: step.stepReference,
    title: step.title,
    stepNumber: step.sequenceNumber,
    status: StepStatusValue[step.status as keyof typeof StepStatusValue],
  }
}

const toDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd')
}

export { toUpdateGoalForm, toUpdateStepForm }
