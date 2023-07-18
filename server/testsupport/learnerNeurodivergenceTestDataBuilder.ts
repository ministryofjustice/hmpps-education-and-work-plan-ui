import type { LearnerNeurodivergence } from 'curiousApiClient'

export default function aValidLearnerNeurodivergence(): LearnerNeurodivergence {
  return {
    prn: 'G6123VU',
    establishmentId: 'MDI',
    neurodivergenceSelfDeclared: ['Dyslexia'],
    selfDeclaredDate: '2022-02-18',
    neurodivergenceAssessed: ['No Identified Neurodiversity Need'],
    assessmentDate: '2022-05-18',
    neurodivergenceSupport: ['Writing support'],
    supportDate: '2022-02-18',
  }
}
