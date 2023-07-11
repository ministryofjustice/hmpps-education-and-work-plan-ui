import type { AddStepForm } from 'forms'

const aValidAddStepForm = (): AddStepForm => {
  return {
    stepNumber: 1,
    title: 'Book Spanish course',
    targetDateRange: 'ZERO_TO_THREE_MONTHS',
    action: 'submit-form',
  }
}

const anotherValidAddStepForm = (): AddStepForm => {
  return {
    stepNumber: 2,
    title: 'Complete Spanish course',
    targetDateRange: 'THREE_TO_SIX_MONTHS',
    action: 'submit-form',
  }
}

export { aValidAddStepForm, anotherValidAddStepForm }
