import type { AffectAbilityToWorkForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'

export default function validateAffectAbilityToWorkForm(
  affectAbilityToWorkForm: AffectAbilityToWorkForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(
    ...formatErrors('affectAbilityToWork', validateAffectAbilityToWork(affectAbilityToWorkForm, prisonerSummary)),
  )
  errors.push(
    ...formatErrors(
      'affectAbilityToWorkOther',
      validateAffectAbilityToWorkOther(affectAbilityToWorkForm, prisonerSummary),
    ),
  )
  return errors
}

const validateAffectAbilityToWork = (
  affectAbilityToWorkForm: AffectAbilityToWorkForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { affectAbilityToWork } = affectAbilityToWorkForm
  if (
    !affectAbilityToWork ||
    affectAbilityToWork.length === 0 ||
    containsInvalidOptions(affectAbilityToWork) ||
    (affectAbilityToWork.length > 1 && affectAbilityToWork.includes(AbilityToWorkValue.NONE))
  ) {
    errors.push(
      `Select factors affecting ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s ability to work or select 'None of these'`,
    )
  }

  return errors
}

/**
 * Return true if any value in the specified array is not in the full set of `AbilityToWorkValue` enum values.
 */
const containsInvalidOptions = (affectAbilityToWork: Array<AbilityToWorkValue>): boolean => {
  const allValidValues = Object.values(AbilityToWorkValue)
  return affectAbilityToWork.some(value => !allValidValues.includes(value))
}

const validateAffectAbilityToWorkOther = (
  affectAbilityToWorkForm: AffectAbilityToWorkForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { affectAbilityToWork, affectAbilityToWorkOther } = affectAbilityToWorkForm

  if (affectAbilityToWork && affectAbilityToWork.includes(AbilityToWorkValue.OTHER) && !affectAbilityToWorkOther) {
    errors.push(`Enter factors affecting ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s ability to work`)
  }

  return errors
}
