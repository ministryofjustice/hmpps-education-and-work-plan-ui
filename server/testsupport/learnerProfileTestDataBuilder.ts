import type { LearnerProfile } from 'curiousApiClient'

export default function aValidLearnerProfile(): LearnerProfile {
  return {
    prn: 'G6123VU',
    establishmentId: 'MDI',
    lddHealthProblem: 'Learner considers himself or herself to have a learning difficulty.',
    languageStatus: 'Bilingual',
    primaryLDDAndHealthProblem: 'Visual impairment',
    additionalLDDAndHealthProblems: ['Hearing impairment'],
  }
}
