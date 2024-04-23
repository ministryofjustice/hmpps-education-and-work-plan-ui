import type { QualificationDetailsForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import formatQualificationLevelFilter from '../../../filters/formatQualificationLevelFilter'

export default function validateQualificationDetailsForm(
  qualificationDetailsForm: QualificationDetailsForm,
  qualificationLevel: QualificationLevelValue,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(
    ...formatErrors(
      'qualificationSubject',
      validateQualificationSubject(qualificationDetailsForm, qualificationLevel, prisonerSummary),
    ),
  )
  errors.push(
    ...formatErrors(
      'qualificationGrade',
      validateQualificationGrade(qualificationDetailsForm, qualificationLevel, prisonerSummary),
    ),
  )
  return errors
}

const validateQualificationSubject = (
  qualificationDetailsForm: QualificationDetailsForm,
  qualificationLevel: QualificationLevelValue,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { qualificationSubject } = qualificationDetailsForm
  if (!qualificationSubject) {
    const formattedLevel = formatQualificationLevel(qualificationLevel)
    errors.push(
      `Enter the subject of ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s ${formattedLevel} qualification`,
    )
  } else if (qualificationSubject.length > 100) {
    errors.push('Subject must be 100 characters or less')
  }

  return errors
}

const validateQualificationGrade = (
  qualificationDetailsForm: QualificationDetailsForm,
  qualificationLevel: QualificationLevelValue,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { qualificationGrade } = qualificationDetailsForm
  if (!qualificationGrade) {
    const formattedLevel = formatQualificationLevel(qualificationLevel)
    errors.push(
      `Enter the grade of ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s ${formattedLevel} qualification`,
    )
  } else if (qualificationGrade.length > 50) {
    errors.push('Grade must be 50 characters or less')
  }

  return errors
}

const formatQualificationLevel = (qualificationLevel: string) =>
  formatQualificationLevelFilter(qualificationLevel).toLowerCase()
