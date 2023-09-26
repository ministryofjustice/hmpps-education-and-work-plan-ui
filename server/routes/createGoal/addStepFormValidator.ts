import type { AddStepForm } from 'forms'
import formatErrors from '../errorFormatter'
import validateStepTitle from '../../validators/stepTitleValidator'

export default function validateAddStepForm(addStepForm: AddStepForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('title', validateStepTitle(addStepForm.title)))
  return errors
}
