import type { PreviousWorkExperienceDetailForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import { textValueExceedsLength } from '../../../validators/textValueValidator'

const MAX_JOB_ROLE_LENGTH = 256
const MAX_JOB_DETAILS_LENGTH = 512

export default function validatePreviousWorkExperienceDetailForm(
  previousWorkExperienceDetailForm: PreviousWorkExperienceDetailForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('jobRole', validateJobRole(previousWorkExperienceDetailForm, prisonerSummary)))
  errors.push(...formatErrors('jobDetails', validateJobDetails(previousWorkExperienceDetailForm, prisonerSummary)))
  return errors
}

const validateJobRole = (
  previousWorkExperienceDetailForm: PreviousWorkExperienceDetailForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { jobRole } = previousWorkExperienceDetailForm
  if (!jobRole) {
    errors.push(`Enter the job role ${prisonerSummary.firstName} ${prisonerSummary.lastName} wants to add`)
  } else if (textValueExceedsLength(jobRole, MAX_JOB_ROLE_LENGTH)) {
    errors.push(`Job role must be ${MAX_JOB_ROLE_LENGTH} characters or less`)
  }

  return errors
}

const validateJobDetails = (
  previousWorkExperienceDetailForm: PreviousWorkExperienceDetailForm,
  prisonerSummary: PrisonerSummary,
): Array<string> => {
  const errors: Array<string> = []

  const { jobDetails } = previousWorkExperienceDetailForm
  if (!jobDetails) {
    errors.push(`Enter details of what ${prisonerSummary.firstName} ${prisonerSummary.lastName} did in their job`)
  } else if (textValueExceedsLength(jobDetails, MAX_JOB_DETAILS_LENGTH)) {
    errors.push(`Main tasks and responsibilities must be ${MAX_JOB_DETAILS_LENGTH} characters or less`)
  }

  return errors
}
