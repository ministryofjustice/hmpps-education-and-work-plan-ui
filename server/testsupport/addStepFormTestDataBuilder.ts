import type { AddStepForm } from 'forms'

const aValidAddStepForm = (options?: {
  stepNumber?: number
  title?: string
  action?: 'submit-form' | 'add-another-step'
}): AddStepForm => {
  return {
    stepNumber: options?.stepNumber || 1,
    title: options?.title || 'Book Spanish course',
    action: options?.action || 'submit-form',
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
