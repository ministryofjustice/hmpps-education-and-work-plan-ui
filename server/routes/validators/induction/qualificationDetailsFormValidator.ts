import type { QualificationDetailsForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import formatQualificationLevelFilter from '../../../filters/formatQualificationLevelFilter'

const MAX_QUALIFICATION_SUBJECT_LENGTH = 100
const MAX_QUALIFICATION_GRADE_LENGTH = 50

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
  } else if (qualificationSubject.length > MAX_QUALIFICATION_SUBJECT_LENGTH) {
    errors.push(`Subject must be ${MAX_QUALIFICATION_SUBJECT_LENGTH} characters or less`)
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
  } else if (qualificationGrade.length > MAX_QUALIFICATION_GRADE_LENGTH) {
    errors.push(`Grade must be ${MAX_QUALIFICATION_GRADE_LENGTH} characters or less`)
  }

  return errors
}

const formatQualificationLevel = (qualificationLevel: string) =>
  formatQualificationLevelFilter(qualificationLevel).toLowerCase()
