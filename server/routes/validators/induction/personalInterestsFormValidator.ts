import type { PersonalInterestsForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import PersonalInterestsValue from '../../../enums/personalInterestsValue'
import textValueExceedsLength from '../../../validators/textValueValidator'

const MAX_OTHER_LENGTH = 255

export default function validatePersonalInterestsForm(
  personalInterestsForm: PersonalInterestsForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('personalInterests', validatePersonalInterests(personalInterestsForm, prisonerSummary)))
  errors.push(
    ...formatErrors('personalInterestsOther', validatePersonalInterestsOther(personalInterestsForm, prisonerSummary)),
  )
  return errors
}

const validatePersonalInterests = (
  personalInterestsForm: PersonalInterestsForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { personalInterests } = personalInterestsForm
  if (
    !personalInterests ||
    personalInterests.length === 0 ||
    containsInvalidOptions(personalInterests) ||
    (personalInterests.length > 1 && personalInterests.includes(PersonalInterestsValue.NONE))
  ) {
    errors.push(`Select ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s interests or select 'None of these'`)
  }

  return errors
}

/**
 * Return true if any value in the specified array is not in the full set of `PersonalInterestsValue` enum values.
 */
const containsInvalidOptions = (personalInterests: Array<PersonalInterestsValue>): boolean => {
  const allValidValues = Object.values(PersonalInterestsValue)
  return personalInterests.some(value => !allValidValues.includes(value))
}

const validatePersonalInterestsOther = (
  personalInterestsForm: PersonalInterestsForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { personalInterests, personalInterestsOther } = personalInterestsForm

  if (personalInterests && personalInterests.includes(PersonalInterestsValue.OTHER)) {
    if (!personalInterestsOther) {
      errors.push(`Enter ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s interests`)
    } else if (textValueExceedsLength(personalInterestsOther, MAX_OTHER_LENGTH)) {
      errors.push(`The interests must be ${MAX_OTHER_LENGTH} characters or less`)
    }
  }

  return errors
}
