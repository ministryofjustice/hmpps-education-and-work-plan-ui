import type { InPrisonWorkForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'
import formatErrors from '../../errorFormatter'

export default function validateInPrisonWorkForm(
  inPrisonWorkForm: InPrisonWorkForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('inPrisonWork', validateInPrisonWork(inPrisonWorkForm, prisonerSummary)))
  errors.push(...formatErrors('inPrisonWorkOther', validateInPrisonWorkOther(inPrisonWorkForm, prisonerSummary)))
  return errors
}

const validateInPrisonWork = (inPrisonWorkForm: InPrisonWorkForm, prisonerSummary: PrisonerSummary): Array<string> => {
  const errors: Array<string> = []

  const { inPrisonWork } = inPrisonWorkForm
  if (!inPrisonWork || inPrisonWork.length === 0 || containsInvalidOptions(inPrisonWork)) {
    errors.push(
      `Select the type of work ${prisonerSummary.firstName} ${prisonerSummary.lastName} would like to do in prison`,
    )
  }

  return errors
}

/**
 * Return true if any value in the specified array is not in the full set of `InPrisonWorkValue` enum values.
 */
const containsInvalidOptions = (inPrisonWork: Array<InPrisonWorkValue>): boolean => {
  const allValidValues = Object.values(InPrisonWorkValue)
  return inPrisonWork.some(value => !allValidValues.includes(value))
}

const validateInPrisonWorkOther = (
  inPrisonWorkForm: InPrisonWorkForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { inPrisonWork, inPrisonWorkOther } = inPrisonWorkForm

  if (inPrisonWork && inPrisonWork.includes(InPrisonWorkValue.OTHER) && !inPrisonWorkOther) {
    errors.push(
      `Enter the type of work ${prisonerSummary.firstName} ${prisonerSummary.lastName} would like to do in prison`,
    )
  }

  return errors
}
