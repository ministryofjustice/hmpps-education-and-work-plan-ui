import type { AddStepForm } from 'forms'

const aValidAddStepForm = (): AddStepForm => {
  return {
    stepNumber: 1,
    title: 'Book Spanish course',
    action: 'submit-form',
  }
}

const anotherValidAddStepForm = (): AddStepForm => {
  return {
    stepNumber: 2,
    title: 'Complete Spanish course',
    action: 'submit-form',
  }
}

export { aValidAddStepForm, anotherValidAddStepForm }
