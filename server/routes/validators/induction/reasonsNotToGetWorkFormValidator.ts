import type { ReasonsNotToGetWorkForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import ReasonNotToGetWorkValue from '../../../enums/reasonNotToGetWorkValue'

export default function validateReasonsNotToGetWorkForm(
  reasonsNotToGetWorkForm: ReasonsNotToGetWorkForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(
    ...formatErrors('reasonsNotToGetWork', validateReasonsNotToGetWork(reasonsNotToGetWorkForm, prisonerSummary)),
  )
  errors.push(
    ...formatErrors(
      'reasonsNotToGetWorkOther',
      validateReasonsNotToGetWorkOther(reasonsNotToGetWorkForm, prisonerSummary),
    ),
  )
  return errors
}

const validateReasonsNotToGetWork = (
  reasonsNotToGetWorkForm: ReasonsNotToGetWorkForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { reasonsNotToGetWork } = reasonsNotToGetWorkForm
  if (
    !reasonsNotToGetWork ||
    reasonsNotToGetWork.length === 0 ||
    containsInvalidOptions(reasonsNotToGetWork) ||
    (reasonsNotToGetWork.length > 1 && reasonsNotToGetWork.includes(ReasonNotToGetWorkValue.NOT_SURE))
  ) {
    errors.push(
      `Select what could stop ${prisonerSummary.firstName} ${prisonerSummary.lastName} getting work on release, or select 'Not sure'`,
    )
  }

  return errors
}

/**
 * Return true if any value in the specified array is not in the full set of `ReasonNotToGetWorkValue` enum values.
 */
const containsInvalidOptions = (reasonsNotToGetWork: Array<ReasonNotToGetWorkValue>): boolean => {
  const allValidValues = Object.values(ReasonNotToGetWorkValue)
  return reasonsNotToGetWork.some(value => !allValidValues.includes(value))
}

const validateReasonsNotToGetWorkOther = (
  reasonsNotToGetWorkForm: ReasonsNotToGetWorkForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { reasonsNotToGetWork, reasonsNotToGetWorkOther } = reasonsNotToGetWorkForm

  if (reasonsNotToGetWork && reasonsNotToGetWork.includes(ReasonNotToGetWorkValue.OTHER) && !reasonsNotToGetWorkOther) {
    errors.push(
      `Enter what could stop ${prisonerSummary.firstName} ${prisonerSummary.lastName} getting work on release`,
    )
  }

  return errors
}
