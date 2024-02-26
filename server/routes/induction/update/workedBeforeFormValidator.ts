import type { WorkedBeforeForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'

export default function validateWorkedBeforeForm(
  workedBeforeForm: WorkedBeforeForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('workedBefore', validateWorkedBefore(workedBeforeForm, prisonerSummary)))
  return errors
}

const validateWorkedBefore = (workedBeforeForm: WorkedBeforeForm, prisonerSummary: PrisonerSummary): Array<string> => {
  const errors: Array<string> = []

  const { hasWorkedBefore } = workedBeforeForm
  if (hasWorkedBefore == null) {
    errors.push(`Select whether ${prisonerSummary.firstName} ${prisonerSummary.lastName} has worked before or not`)
  }

  return errors
}
