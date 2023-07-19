import type { Neurodiversity, SupportNeeds } from 'viewModels'
import type { LearnerNeurodivergence, LearnerProfile } from 'curiousApiClient'
import moment from 'moment/moment'

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
  if (learnerProfile && learnerProfile.primaryLDDAndHealthProblem) {
    return [learnerProfile.primaryLDDAndHealthProblem, ...learnerProfile.additionalLDDAndHealthProblems.sort()]
  }
  return undefined
}

export { toSupportNeeds, toNeurodiversity }
