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
        hasSupportNeeds: true,
      },
      {
        prisonId: 'ACI',
        prisonName: 'Altcourse (HMP)',
        rapidAssessmentDate: undefined,
        inDepthAssessmentDate: undefined,
        primaryLddAndHealthNeeds: null,
        additionalLddAndHealthNeeds: [],
        hasSupportNeeds: false,
      },
    ],
    problemRetrievingData: false,
  }
}
