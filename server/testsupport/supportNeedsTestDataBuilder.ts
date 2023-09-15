import type { PrisonerSupportNeeds } from 'viewModels'
import moment from 'moment/moment'

export default function aValidPrisonerSupportNeeds(): PrisonerSupportNeeds {
  return {
    healthAndSupportNeeds: [
      {
        prisonId: 'MDI',
        prisonName: 'MOORLAND (HMP & YOI)',
        rapidAssessmentDate: moment('2022-02-18').toDate(),
        inDepthAssessmentDate: undefined,
        primaryLddAndHealthNeeds: 'Visual impairment',
        additionalLddAndHealthNeeds: [
          'Hearing impairment',
          'Mental health difficulty',
          'Social and emotional difficulties',
        ],
      },
    ],
    neurodiversities: [
      {
        prisonId: 'MDI',
        prisonName: 'MOORLAND (HMP & YOI)',
        supportNeeded: ['Writing support'],
        supportNeededRecordedDate: moment('2022-02-18').toDate(),
        selfDeclaredNeurodiversity: ['Dyslexia'],
        selfDeclaredRecordedDate: moment('2022-02-18').toDate(),
        assessedNeurodiversity: ['No Identified Neurodiversity Need'],
        assessmentDate: moment('2022-05-18').toDate(),
      },
    ],
    problemRetrievingData: false,
  }
}
