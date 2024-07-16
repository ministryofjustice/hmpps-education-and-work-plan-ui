import { parseISO, startOfDay } from 'date-fns'
import type { HealthAndSupportNeeds, Neurodiversity, PrisonerSupportNeeds } from 'viewModels'
import type { LearnerNeurodivergence, LearnerProfile } from 'curiousApiClient'

const toPrisonerSupportNeeds = (
  learnerProfiles: Array<LearnerProfile>,
  learnerNeurodivergences: Array<LearnerNeurodivergence>,
): PrisonerSupportNeeds => {
  return {
    problemRetrievingData: false,
    healthAndSupportNeeds: learnerProfiles?.map(profile => toHealthAndSupportNeeds(profile)),
    neurodiversities: learnerNeurodivergences?.map(neurodiversity => toNeurodiversity(neurodiversity)),
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

const toNeurodiversity = (learnerNeurodivergence: LearnerNeurodivergence): Neurodiversity => {
  if (learnerNeurodivergence) {
    return {
      prisonId: learnerNeurodivergence.establishmentId,
      prisonName: learnerNeurodivergence.establishmentName,
      supportNeeded: learnerNeurodivergence.neurodivergenceSupport,
      supportNeededRecordedDate: dateOrNull(learnerNeurodivergence.supportDate),
      selfDeclaredNeurodiversity: learnerNeurodivergence.neurodivergenceSelfDeclared,
      selfDeclaredRecordedDate: dateOrNull(learnerNeurodivergence.selfDeclaredDate),
      assessedNeurodiversity: learnerNeurodivergence.neurodivergenceAssessed,
      assessmentDate: dateOrNull(learnerNeurodivergence.assessmentDate),
    }
  }
  return undefined
}

const dateOrNull = (value: string): Date | undefined => {
  return value ? startOfDay(parseISO(value)) : undefined
}

export { toPrisonerSupportNeeds, toNeurodiversity }
