import type { WorkInterestRolesForm } from 'inductionForms'
import formatErrors from '../../errorFormatter'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'
import formatJobTypeFilter from '../../../filters/formatJobTypeFilter'

const MAX_JOB_ROLE_LENGTH = 512

export default function validateWorkInterestRolesForm(
  workInterestRolesForm: WorkInterestRolesForm,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  workInterestRolesForm.workInterestRoles?.forEach(keyValuePair => {
    if (keyValuePair[0] !== WorkInterestTypeValue.OTHER) {
      errors.push(...formatErrors(keyValuePair[0], validateValue(keyValuePair)))
    } else {
      errors.push(
        ...formatErrors(
          keyValuePair[0],
          validateOtherValue(keyValuePair, workInterestRolesForm.workInterestTypesOther),
        ),
      )
    }
  })

  return errors
}

const validateValue = (keyValuePair: [WorkInterestTypeValue, string]): Array<string> => {
  const errors: Array<string> = []

  if (keyValuePair[1]?.length > MAX_JOB_ROLE_LENGTH) {
    errors.push(
      `The ${formatJobTypeFilter(keyValuePair[0])} job role must be ${MAX_JOB_ROLE_LENGTH} characters or less`,
    )
  }

  return errors
}

const validateOtherValue = (
  keyValuePair: [WorkInterestTypeValue, string],
  otherWorkInterestType: string,
): Array<string> => {
  const errors: Array<string> = []

  if (keyValuePair[1]?.length > MAX_JOB_ROLE_LENGTH) {
    errors.push(`The ${otherWorkInterestType} job role must be ${MAX_JOB_ROLE_LENGTH} characters or less`)
  }

  return errors
}
