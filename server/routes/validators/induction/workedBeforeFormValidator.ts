import type { WorkedBeforeForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

export default function validateWorkedBeforeForm(
  workedBeforeForm: WorkedBeforeForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('hasWorkedBefore', validateWorkedBefore(workedBeforeForm, prisonerSummary)))
  errors.push(...formatErrors('hasWorkedBeforeNotRelevantReason', validateSkillsOther(workedBeforeForm)))
  return errors
}

const validateWorkedBefore = (workedBeforeForm: WorkedBeforeForm, prisonerSummary: PrisonerSummary): Array<string> => {
  const errors: Array<string> = []

  const { hasWorkedBefore } = workedBeforeForm
  if (!hasWorkedBefore) {
    errors.push(`Select whether ${prisonerSummary.firstName} ${prisonerSummary.lastName} has worked before or not`)
  }

  return errors
}

const validateSkillsOther = (workedBeforeForm: WorkedBeforeForm): Array<string> => {
  const errors: Array<string> = []

  const { hasWorkedBefore, hasWorkedBeforeNotRelevantReason } = workedBeforeForm

  if (hasWorkedBefore === HasWorkedBeforeValue.NOT_RELEVANT && !hasWorkedBeforeNotRelevantReason) {
    errors.push('Enter the reason why not relevant')
  }

  return errors
}
