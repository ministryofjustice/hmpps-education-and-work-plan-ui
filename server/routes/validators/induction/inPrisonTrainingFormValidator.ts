import type { InPrisonTrainingForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import InPrisonTrainingValue from '../../../enums/inPrisonTrainingValue'

const MAX_OTHER_LENGTH = 255

export default function validateInPrisonTrainingForm(
  inPrisonTrainingForm: InPrisonTrainingForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('inPrisonTraining', validateInPrisonTraining(inPrisonTrainingForm, prisonerSummary)))
  errors.push(
    ...formatErrors('inPrisonTrainingOther', validateInPrisonTrainingOther(inPrisonTrainingForm, prisonerSummary)),
  )
  return errors
}

const validateInPrisonTraining = (
  inPrisonTrainingForm: InPrisonTrainingForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { inPrisonTraining } = inPrisonTrainingForm
  if (!inPrisonTraining || inPrisonTraining.length === 0 || containsInvalidOptions(inPrisonTraining)) {
    errors.push(
      `Select the type of training ${prisonerSummary.firstName} ${prisonerSummary.lastName} would like to do in prison`,
    )
  }

  return errors
}

/**
 * Return true if any value in the specified array is not in the full set of `InPrisonTrainingValue` enum values.
 */
const containsInvalidOptions = (inPrisonTraining: Array<InPrisonTrainingValue>): boolean => {
  const allValidValues = Object.values(InPrisonTrainingValue)
  return inPrisonTraining.some(value => !allValidValues.includes(value))
}

const validateInPrisonTrainingOther = (
  inPrisonTrainingForm: InPrisonTrainingForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { inPrisonTraining, inPrisonTrainingOther } = inPrisonTrainingForm

  if (inPrisonTraining && inPrisonTraining.includes(InPrisonTrainingValue.OTHER)) {
    if (!inPrisonTrainingOther) {
      errors.push(
        `Enter the type of type of training ${prisonerSummary.firstName} ${prisonerSummary.lastName} would like to do in prison`,
      )
    } else if (inPrisonTrainingOther.length > MAX_OTHER_LENGTH) {
      errors.push(`The type of training must be ${MAX_OTHER_LENGTH} characters or less`)
    }
  }

  return errors
}
