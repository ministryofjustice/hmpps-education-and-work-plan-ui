import type { HealthAndSupportNeeds, Neurodiversity, PrisonerSupportNeeds } from 'viewModels'
import type { LearnerNeurodivergence, LearnerProfile } from 'curiousApiClient'
import moment from 'moment/moment'

const toPrisonerSupportNeeds = (
  learnerProfiles: Array<LearnerProfile>,
  learnerNeurodivergences: Array<LearnerNeurodivergence>,
): PrisonerSupportNeeds => {
  return {
    healthAndSupportNeeds: learnerProfiles?.map(profile => toHealthAndSupportNeeds(profile)),
    neurodiversities: learnerNeurodivergences?.map(neurodiversity => toNeurodiversity(neurodiversity)),
  }
}

const toHealthAndSupportNeeds = (learnerProfile: LearnerProfile): HealthAndSupportNeeds => {
  if (learnerProfile) {
    return {
      prisonId: learnerProfile.establishmentId,
      prisonName: learnerProfile.establishmentName,
      languageSupportNeeded: learnerProfile.languageStatus,
      lddAndHealthNeeds: toLddAndHealthNeeds(learnerProfile),
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
      supportNeededRecordedDate: moment(learnerNeurodivergence.supportDate || null, true).toDate(),
      selfDeclaredNeurodiversity: learnerNeurodivergence.neurodivergenceSelfDeclared,
      selfDeclaredRecordedDate: moment(learnerNeurodivergence.selfDeclaredDate || null, true).toDate(),
      assessedNeurodiversity: learnerNeurodivergence.neurodivergenceAssessed,
      assessmentDate: moment(learnerNeurodivergence.assessmentDate || null, true).toDate(),
    }
  }
  return undefined
}

const toLddAndHealthNeeds = (learnerProfile: LearnerProfile): Array<string> => {
  if (learnerProfile.primaryLDDAndHealthProblem) {
    return [learnerProfile.primaryLDDAndHealthProblem, ...learnerProfile.additionalLDDAndHealthProblems.sort()]
  }
  return undefined
}

export { toPrisonerSupportNeeds, toNeurodiversity }
