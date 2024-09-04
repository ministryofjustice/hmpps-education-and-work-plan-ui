import type { AdditionalTrainingForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'

const MAX_OTHER_LENGTH = 512

export default function validateAdditionalTrainingForm(
  additionalTrainingForm: AdditionalTrainingForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(
    ...formatErrors('additionalTraining', validateAdditionalTraining(additionalTrainingForm, prisonerSummary)),
  )
  errors.push(
    ...formatErrors(
      'additionalTrainingOther',
      validateAdditionalTrainingOther(additionalTrainingForm, prisonerSummary),
    ),
  )
  return errors
}

const validateAdditionalTraining = (
  additionalTrainingForm: AdditionalTrainingForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { additionalTraining } = additionalTrainingForm
  if (
    !additionalTraining ||
    additionalTraining.length === 0 ||
    containsInvalidOptions(additionalTraining) ||
    (additionalTraining.length > 1 && additionalTraining.includes(AdditionalTrainingValue.NONE))
  ) {
    errors.push(
      `Select the type of training or vocational qualification ${prisonerSummary.firstName} ${prisonerSummary.lastName} has`,
    )
  }

  return errors
}

/**
 * Return true if any value in the specified array is not in the full set of `AdditionalTrainingValue` enum values.
 */
const containsInvalidOptions = (additionalTraining: Array<AdditionalTrainingValue>): boolean => {
  const allValidValues = Object.values(AdditionalTrainingValue)
  return additionalTraining.some(value => !allValidValues.includes(value))
}

const validateAdditionalTrainingOther = (
  additionalTrainingForm: AdditionalTrainingForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { additionalTraining, additionalTrainingOther } = additionalTrainingForm

  if (additionalTraining && additionalTraining.includes(AdditionalTrainingValue.OTHER)) {
    if (!additionalTrainingOther) {
      errors.push(
        `Enter the type of training or vocational qualification ${prisonerSummary.firstName} ${prisonerSummary.lastName} has`,
      )
    } else if (additionalTrainingOther.length > MAX_OTHER_LENGTH) {
      errors.push(`The type of training must be ${MAX_OTHER_LENGTH} characters or less`)
    }
  }

  return errors
}
