import type { SupportNeeds } from 'viewModels'
import { toSupportNeeds } from './supportNeedsMapper'

describe('supportNeedsMapper', () => {
  it('should map to SupportNeeds', () => {
    // Given
    const learnerProfile = {
      prn: 'G6123VU',
      establishmentId: 'MDI',
      lddHealthProblem: 'Learner considers himself or herself to have a learning difficulty.',
      languageStatus: 'Bilingual',
      primaryLDDAndHealthProblem: 'Visual impairment',
      additionalLDDAndHealthProblems: [
        'Hearing impairment',
        'Social and emotional difficulties',
        'Mental health difficulty',
      ],
    }
    const learnerNeurodivergence = {
      prn: 'G6123VU',
      establishmentId: 'MDI',
      neurodivergenceSelfDeclared: ['Dyslexia'],
      selfDeclaredDate: '2022-02-18',
      neurodivergenceAssessed: ['No Identified Neurodiversity Need'],
      assessmentDate: '2022-05-18',
      neurodivergenceSupport: ['Writing support'],
      supportDate: '2022-02-18',
    }

    const expectedSupportNeeds = {
      languageSupportNeeded: false,
      lddAndHealthNeeds: [
        'Visual impairment',
        'Hearing impairment',
        'Mental health difficulty',
        'Social and emotional difficulties',
      ],
      neurodiversity: {
        supportNeeded: ['Writing support'],
        selfDeclaredNeurodiversity: ['Dyslexia'],
        assessedNeurodiversity: ['No Identified Neurodiversity Need'],
      },
    } as SupportNeeds

    // When
    const supportNeeds = toSupportNeeds(learnerProfile, learnerNeurodivergence)

    // Then
    expect(supportNeeds).toEqual(expectedSupportNeeds)
  })
})
