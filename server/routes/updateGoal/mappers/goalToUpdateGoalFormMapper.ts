import type { UpdateGoalForm, UpdateStepForm } from 'forms'
import type { Goal, Step } from 'viewModels'
import { format, formatISO } from 'date-fns'
import { UTCDate } from '@date-fns/utc'
import GoalStatusValue from '../../../enums/goalStatusValue'
import StepStatusValue from '../../../enums/stepStatusValue'

const toUpdateGoalForm = (goal: Goal): UpdateGoalForm => {
  return {
    reference: goal.goalReference,
    title: goal.title,
    createdAt: formatISO(new UTCDate(goal.createdAt)),
    targetCompletionDate: toDateString(goal.targetCompletionDate),
    manuallyEnteredTargetCompletionDate: null,
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
  return format(date, 'd/M/yyyy')
}

export { toUpdateGoalForm, toUpdateStepForm }
