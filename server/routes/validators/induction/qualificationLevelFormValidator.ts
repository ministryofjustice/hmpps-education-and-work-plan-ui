import type { QualificationLevelForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

export default function validateQualificationLevelForm(
  qualificationLevelForm: QualificationLevelForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(
    ...formatErrors('qualificationLevel', validateQualificationLevel(qualificationLevelForm, prisonerSummary)),
  )
  return errors
}

const validateQualificationLevel = (
  qualificationLevelForm: QualificationLevelForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { qualificationLevel } = qualificationLevelForm
  if (!qualificationLevel || qualificationLevel.length === 0 || containsInvalidOptions(qualificationLevel)) {
    errors.push(
      `Select the level of qualification ${prisonerSummary.firstName} ${prisonerSummary.lastName} wants to add`,
    )
  }
  return errors
}

/**
 * Return true if the supplied value is not in the full set of `QualificationLevelValue` enum values.
 */
const containsInvalidOptions = (qualificationLevel: QualificationLevelValue): boolean => {
  const allValidValues = Object.values(QualificationLevelValue)
  return !allValidValues.includes(qualificationLevel)
}
