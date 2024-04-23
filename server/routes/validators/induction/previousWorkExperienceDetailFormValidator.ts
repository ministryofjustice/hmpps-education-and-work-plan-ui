import type { PreviousWorkExperienceDetailForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'

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
  } else if (jobRole.length > 200) {
    errors.push('Job role must be 200 characters or less')
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
  } else if (jobDetails.length > 4000) {
    errors.push('Main tasks and responsibilities must be 4000 characters or less')
  }

  return errors
}
