import type { LearnerProfile } from 'curiousApiClient'

export default function aValidLearnerProfile(): LearnerProfile {
  return {
    prn: 'G6123VU',
    establishmentId: 'MDI',
    establishmentName: 'MOORLAND (HMP & YOI)',
    lddHealthProblem: 'Learner considers himself or herself to have a learning difficulty.',
    languageStatus: 'Bilingual',
    primaryLDDAndHealthProblem: 'Visual impairment',
    additionalLDDAndHealthProblems: ['Hearing impairment'],
    qualifications: [
      {
        qualificationType: 'English',
        qualificationGrade: 'Level 1',
        assessmentDate: '2012-02-16',
      },
    ],
  }
}
