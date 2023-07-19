import type { SupportNeeds } from 'viewModels'
import moment from 'moment/moment'

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
      supportNeededRecordedDate: moment('2022-02-18').toDate(),
      selfDeclaredNeurodiversity: ['Dyslexia'],
      selfDeclaredRecordedDate: moment('2022-02-18').toDate(),
      assessedNeurodiversity: ['No Identified Neurodiversity Need'],
      assessmentDate: moment('2022-05-18').toDate(),
    },
  }
}
