import type { SupportNeeds } from 'viewModels'

export default function aValidSupportNeeds(): SupportNeeds {
  return {
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
  }
}
