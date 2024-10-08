import type { PrisonerSupportNeeds } from 'viewModels'
import moment from 'moment/moment'

export default function aValidPrisonerSupportNeeds(): PrisonerSupportNeeds {
  return {
    healthAndSupportNeeds: [
      {
        prisonId: 'MDI',
        prisonName: 'Moorland (HMP & YOI)',
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
    problemRetrievingData: false,
  }
}
