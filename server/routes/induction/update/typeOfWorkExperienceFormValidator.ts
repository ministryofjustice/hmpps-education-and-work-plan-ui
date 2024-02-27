import type { TypeOfWorkExperienceForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'

export default function validateTypeOfWorkExperienceForm(
  typeOfWorkExperienceForm: TypeOfWorkExperienceForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(
    ...formatErrors('typeOfWorkExperience', validateTypeOfWorkExperience(typeOfWorkExperienceForm, prisonerSummary)),
  )
  errors.push(
    ...formatErrors(
      'typeOfWorkExperienceOther',
      validateTypeOfWorkExperienceOther(typeOfWorkExperienceForm, prisonerSummary),
    ),
  )
  return errors
}

const validateTypeOfWorkExperience = (
  typeOfWorkExperienceForm: TypeOfWorkExperienceForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { typeOfWorkExperience } = typeOfWorkExperienceForm
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
  typeOfWorkExperienceForm: TypeOfWorkExperienceForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { typeOfWorkExperience, typeOfWorkExperienceOther } = typeOfWorkExperienceForm

  if (
    typeOfWorkExperience &&
    typeOfWorkExperience.includes(TypeOfWorkExperienceValue.OTHER) &&
    !typeOfWorkExperienceOther
  ) {
    errors.push(`Enter the type of work ${prisonerSummary.firstName} ${prisonerSummary.lastName} has done before`)
  }

  return errors
}
