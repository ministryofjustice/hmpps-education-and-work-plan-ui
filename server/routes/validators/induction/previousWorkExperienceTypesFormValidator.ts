import type { PreviousWorkExperienceTypesForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'

const MAX_OTHER_LENGTH = 256

export default function validatePreviousWorkExperienceTypesForm(
  previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(
    ...formatErrors(
      'typeOfWorkExperience',
      validateTypeOfWorkExperience(previousWorkExperienceTypesForm, prisonerSummary),
    ),
  )
  errors.push(
    ...formatErrors(
      'typeOfWorkExperienceOther',
      validateTypeOfWorkExperienceOther(previousWorkExperienceTypesForm, prisonerSummary),
    ),
  )
  return errors
}

const validateTypeOfWorkExperience = (
  previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { typeOfWorkExperience } = previousWorkExperienceTypesForm
  if (!typeOfWorkExperience || typeOfWorkExperience.length === 0 || containsInvalidOptions(typeOfWorkExperience)) {
    errors.push(`Select the type of work ${prisonerSummary.firstName} ${prisonerSummary.lastName} has done before`)
  }

  return errors
}

/**
 * Return true if any value in the specified array is not in the full set of `TypeOfWorkExperienceValue` enum values.
 */
const containsInvalidOptions = (typeOfWorkExperience: Array<TypeOfWorkExperienceValue>): boolean => {
  const allValidValues = Object.values(TypeOfWorkExperienceValue)
  return typeOfWorkExperience.some(value => !allValidValues.includes(value))
}

const validateTypeOfWorkExperienceOther = (
  previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { typeOfWorkExperience, typeOfWorkExperienceOther } = previousWorkExperienceTypesForm

  if (typeOfWorkExperience && typeOfWorkExperience.includes(TypeOfWorkExperienceValue.OTHER)) {
    if (!typeOfWorkExperienceOther) {
      errors.push(`Enter the type of work ${prisonerSummary.firstName} ${prisonerSummary.lastName} has done before`)
    } else if (typeOfWorkExperienceOther.length > MAX_OTHER_LENGTH) {
      errors.push(`The type of work must be ${MAX_OTHER_LENGTH} characters or less`)
    }
  }

  return errors
}
