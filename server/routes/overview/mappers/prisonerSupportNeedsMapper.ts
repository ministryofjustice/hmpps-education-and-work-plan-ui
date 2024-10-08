import { parseISO, startOfDay } from 'date-fns'
import type { HealthAndSupportNeeds, PrisonerSupportNeeds } from 'viewModels'
import type { LearnerProfile } from 'curiousApiClient'

const toPrisonerSupportNeeds = (learnerProfiles: Array<LearnerProfile>): PrisonerSupportNeeds => {
  return {
    problemRetrievingData: false,
    healthAndSupportNeeds: learnerProfiles?.map(profile => toHealthAndSupportNeeds(profile)),
  }
}

const toHealthAndSupportNeeds = (learnerProfile: LearnerProfile): HealthAndSupportNeeds => {
  if (learnerProfile) {
    return {
      prisonId: learnerProfile.establishmentId,
      prisonName: learnerProfile.establishmentName,
      rapidAssessmentDate: dateOrNull(learnerProfile.rapidAssessmentDate),
      inDepthAssessmentDate: dateOrNull(learnerProfile.inDepthAssessmentDate),
      primaryLddAndHealthNeeds: learnerProfile.primaryLDDAndHealthProblem,
      additionalLddAndHealthNeeds: learnerProfile.additionalLDDAndHealthProblems?.sort() || [],
    }
  }
  return undefined
}

const dateOrNull = (value: string): Date | undefined => {
  return value ? startOfDay(parseISO(value)) : undefined
}

export default toPrisonerSupportNeeds
