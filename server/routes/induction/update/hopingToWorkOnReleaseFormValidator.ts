import type { HopingToWorkOnReleaseForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

export default function validateHopingToWorkOnReleaseForm(
  hopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('hopingToGetWork', validateHopingToGetWork(hopingToWorkOnReleaseForm, prisonerSummary)))

  return errors
}

const validateHopingToGetWork = (
  hopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { hopingToGetWork } = hopingToWorkOnReleaseForm
  if (!hopingToGetWork || containsInvalidOption(hopingToGetWork)) {
    errors.push(`Select whether ${prisonerSummary.firstName} ${prisonerSummary.lastName} is hoping to get work`)
  }

  return errors
}

/**
 * Return true if the value specified is not in the full set of `HopingToGetWorkValue` enum values.
 */
const containsInvalidOption = (hopingToGetWorkValue: HopingToGetWorkValue): boolean => {
  const allValidValues = Object.values(HopingToGetWorkValue)
  return !allValidValues.includes(hopingToGetWorkValue)
}
