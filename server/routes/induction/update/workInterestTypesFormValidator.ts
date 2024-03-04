import type { WorkInterestTypesForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'

export default function validateWorkInterestTypesForm(
  workInterestTypesForm: WorkInterestTypesForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('workInterestTypes', validateWorkInterestTypes(workInterestTypesForm, prisonerSummary)))
  errors.push(
    ...formatErrors('workInterestTypesOther', validateWorkInterestTypesOther(workInterestTypesForm, prisonerSummary)),
  )
  return errors
}

const validateWorkInterestTypes = (
  workInterestTypesForm: WorkInterestTypesForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { workInterestTypes } = workInterestTypesForm
  if (!workInterestTypes || workInterestTypes.length === 0 || containsInvalidOptions(workInterestTypes)) {
    errors.push(`Select the type of work ${prisonerSummary.firstName} ${prisonerSummary.lastName} is interested in`)
  }

  return errors
}

/**
 * Return true if any value in the specified array is not in the full set of `WorkInterestTypeValue` enum values.
 */
const containsInvalidOptions = (workInterestTypes: Array<WorkInterestTypeValue>): boolean => {
  const allValidValues = Object.values(WorkInterestTypeValue)
  return workInterestTypes.some(value => !allValidValues.includes(value))
}

const validateWorkInterestTypesOther = (
  workInterestTypesForm: WorkInterestTypesForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { workInterestTypes, workInterestTypesOther } = workInterestTypesForm

  if (workInterestTypes && workInterestTypes.includes(WorkInterestTypeValue.OTHER) && !workInterestTypesOther) {
    errors.push(`Enter the type of work ${prisonerSummary.firstName} ${prisonerSummary.lastName} is interested in`)
  }

  return errors
}
