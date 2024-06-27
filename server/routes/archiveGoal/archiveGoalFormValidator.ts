import type { ArchiveGoalForm } from 'forms'
import formatErrors from '../errorFormatter'
import ReasonToArchiveGoalValue from '../../enums/ReasonToArchiveGoalValue'

export default function validateArchiveGoalForm(archiveGoalForm: ArchiveGoalForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []
  errors.push(...formatErrors('reason', validateReason(archiveGoalForm)))
  errors.push(...formatErrors('reasonOther', validateReasonOther(archiveGoalForm)))
  return errors
}

const validateReason = (archiveGoalForm: ArchiveGoalForm): Array<string> => {
  const errors: Array<string> = []

  const { reason } = archiveGoalForm
  if (!reason) {
    errors.push(`Select a reason to archive the goal`)
  }

  return errors
}

const MAX_REASON_OTHER_LENGTH = 200

const validateReasonOther = (archiveGoalForm: ArchiveGoalForm): Array<string> => {
  const errors: Array<string> = []

  const { reason, reasonOther } = archiveGoalForm
  if (reason === ReasonToArchiveGoalValue.OTHER && !reasonOther) {
    errors.push('Enter the reason you are archiving the goal')
  } else if (reason === ReasonToArchiveGoalValue.OTHER && reasonOther.length > MAX_REASON_OTHER_LENGTH) {
    errors.push(`The reason must be ${MAX_REASON_OTHER_LENGTH} characters or less`)
  }

  return errors
}
