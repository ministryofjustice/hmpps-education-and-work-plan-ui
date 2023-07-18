import type { Neurodiversity, SupportNeeds } from 'viewModels'
import type { LearnerNeurodivergence, LearnerProfile } from 'curiousApiClient'

const toSupportNeeds = (
  learnerProfile: LearnerProfile,
  learnerNeurodivergence: LearnerNeurodivergence,
): SupportNeeds => {
  return {
    languageSupportNeeded: false, // TODO - how do we derive this?
    lddAndHealthNeeds: toLddAndHealthNeeds(learnerProfile),
    neurodiversity: toNeurodiversity(learnerNeurodivergence),
  }
}
const toNeurodiversity = (learnerNeurodivergence: LearnerNeurodivergence): Neurodiversity => {
  if (learnerNeurodivergence) {
    return {
      supportNeeded: learnerNeurodivergence.neurodivergenceSupport,
      selfDeclaredNeurodiversity: learnerNeurodivergence.neurodivergenceSelfDeclared,
      assessedNeurodiversity: learnerNeurodivergence.neurodivergenceAssessed,
    }
  }
  return undefined
}

const toLddAndHealthNeeds = (learnerProfile: LearnerProfile): Array<string> => {
  if (learnerProfile && learnerProfile.primaryLDDAndHealthProblem) {
    return [learnerProfile.primaryLDDAndHealthProblem, ...learnerProfile.additionalLDDAndHealthProblems.sort()]
  }
  return undefined
}

export { toSupportNeeds, toNeurodiversity }
