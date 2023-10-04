import type { UpdateGoalForm, UpdateStepForm } from 'forms'
import type { Goal, Step } from 'viewModels'
import moment from 'moment'

const toUpdateGoalForm = (goal: Goal): UpdateGoalForm => {
  return {
    reference: goal.goalReference,
    title: goal.title,
    createdAt: goal.createdAt,
    targetCompletionDate: toDateString(goal.targetCompletionDate),
    'targetCompletionDate-day': null,
    'targetCompletionDate-month': null,
    'targetCompletionDate-year': null,
    status: goal.status,
    note: goal.note,
    steps: goal.steps.map(step => toUpdateStepForm(step)),
    originalTargetCompletionDate: toDateString(goal.targetCompletionDate),
  }
}

const toUpdateStepForm = (step: Step): UpdateStepForm => {
  return {
    reference: step.stepReference,
    title: step.title,
    stepNumber: step.sequenceNumber,
    status: step.status,
  }
}

const toDateString = (date: Date): string => {
  return moment(date).format('YYYY-MM-DD')
}

export { toUpdateGoalForm, toUpdateStepForm }
