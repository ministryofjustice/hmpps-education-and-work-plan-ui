import type { WantToAddQualificationsForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'

export default function validateWantToAddQualificationsForm(
  wantToAddQualificationsForm: WantToAddQualificationsForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(
    ...formatErrors(
      'wantToAddQualifications',
      validateWantToAddQualifications(wantToAddQualificationsForm, prisonerSummary),
    ),
  )
  return errors
}

const validateWantToAddQualifications = (
  wantToAddQualificationsForm: WantToAddQualificationsForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { wantToAddQualifications } = wantToAddQualificationsForm
  if (!wantToAddQualifications) {
    errors.push(
      `Select whether ${prisonerSummary.firstName} ${prisonerSummary.lastName} wants to record any other educational qualifications`,
    )
  }

  return errors
}
