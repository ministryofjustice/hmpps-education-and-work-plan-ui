import type { AddStepForm } from 'forms'
import formatErrors from '../errorFormatter'
import validateStepTitle from '../../validators/stepTitleValidator'
import validateStepTargetDateRange from '../../validators/stepTargetDateRangeValidator'

export default function validateAddStepForm(addStepForm: AddStepForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('title', validateStepTitle(addStepForm.title)))
  errors.push(...formatErrors('targetDateRange', validateStepTargetDateRange(addStepForm.targetDateRange)))
  return errors
}
