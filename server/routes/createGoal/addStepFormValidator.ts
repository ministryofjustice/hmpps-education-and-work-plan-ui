import type { AddStepForm } from 'forms'
import formatErrors from '../errorFormatter'
import validateStepTitle from '../../validators/stepTitleValidator'
import validateStepTargetDate from '../../validators/stepTargetDateValidator'

export default function validateAddStepForm(addStepForm: AddStepForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('title', validateStepTitle(addStepForm.title)))
  errors.push(...formatErrors('targetDate', validateStepTargetDate(addStepForm.targetDate)))
  return errors
}
