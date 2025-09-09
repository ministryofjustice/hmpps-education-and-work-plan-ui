import { parseISO, startOfDay } from 'date-fns'
import type { HealthAndSupportNeeds, PrisonerSupportNeeds } from 'viewModels'
import type { LearnerProfile } from 'curiousApiClient'

const toPrisonerSupportNeeds = (
  learnerProfiles: Array<LearnerProfile>,
  prisonNamesById: Record<string, string>,
): PrisonerSupportNeeds => ({
  problemRetrievingData: false,
  healthAndSupportNeeds: learnerProfiles.map(profile => toHealthAndSupportNeeds(profile, prisonNamesById)),
})

const toHealthAndSupportNeeds = (
  learnerProfile: LearnerProfile,
  prisonNamesById: Record<string, string>,
): HealthAndSupportNeeds => ({
  prisonId: learnerProfile.establishmentId,
  prisonName: prisonNamesById[learnerProfile.establishmentId] || learnerProfile.establishmentId,
  rapidAssessmentDate: dateOrNull(learnerProfile.rapidAssessmentDate),
  inDepthAssessmentDate: dateOrNull(learnerProfile.inDepthAssessmentDate),
  primaryLddAndHealthNeeds: learnerProfile.primaryLDDAndHealthProblem,
  additionalLddAndHealthNeeds: learnerProfile.additionalLDDAndHealthProblems?.sort() || [],
  hasSupportNeeds: !!(
    learnerProfile.rapidAssessmentDate ||
    learnerProfile.inDepthAssessmentDate ||
    learnerProfile.primaryLddAndHealthNeeds ||
    (learnerProfile.additionalLddAndHealthNeeds || []).length > 0
  ),
})

const dateOrNull = (value: string): Date | undefined => {
  return value ? startOfDay(parseISO(value)) : undefined
}

export default toPrisonerSupportNeeds
