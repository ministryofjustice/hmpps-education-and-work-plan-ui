import type { HighestLevelOfEducationForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import EducationLevelValue from '../../../enums/educationLevelValue'

export default function validateHighestLevelOfEducationForm(
  highestLevelOfEducationForm: HighestLevelOfEducationForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('educationLevel', validateEducationLevel(highestLevelOfEducationForm, prisonerSummary)))

  return errors
}

const validateEducationLevel = (
  highestLevelOfEducationForm: HighestLevelOfEducationForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { educationLevel } = highestLevelOfEducationForm
  if (!educationLevel || containsInvalidOption(educationLevel)) {
    errors.push(`Select ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s highest level of education`)
  }

  return errors
}

/**
 * Return true if the value specified is not in the full set of `EducationLevelValue` enum values.
 */
const containsInvalidOption = (educationLevel: EducationLevelValue): boolean => {
  const allValidValues = Object.values(EducationLevelValue)
  return !allValidValues.includes(educationLevel)
}
