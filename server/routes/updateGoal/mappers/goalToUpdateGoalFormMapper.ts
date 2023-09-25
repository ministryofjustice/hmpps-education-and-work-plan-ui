import type { UpdateGoalForm, UpdateStepForm } from 'forms'
import type { Goal, Step } from 'viewModels'

const toUpdateGoalForm = (goal: Goal): UpdateGoalForm => {
  return {
    reference: goal.goalReference,
    title: goal.title,
    targetCompletionDate: goal.targetCompletionDate,
    status: goal.status,
    note: goal.note,
    steps: goal.steps.map(step => toUpdateStepForm(step)),
  } as UpdateGoalForm
}

const toUpdateStepForm = (step: Step): UpdateStepForm => {
  return {
    reference: step.stepReference,
    title: step.title,
    targetDateRange: step.targetDateRange,
    stepNumber: step.sequenceNumber,
    status: step.status,
  } as UpdateStepForm
}

export { toUpdateGoalForm, toUpdateStepForm }
