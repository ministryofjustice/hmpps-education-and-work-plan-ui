import type { PrisonerSupportNeeds } from 'viewModels'
import { startOfDay } from 'date-fns'

export default function aValidPrisonerSupportNeeds(): PrisonerSupportNeeds {
  return {
    lddAssessments: [
      {
        prisonId: 'MDI',
        rapidAssessmentDate: startOfDay('2022-02-18'),
        inDepthAssessmentDate: undefined,
        primaryLddAndHealthNeeds: 'Visual impairment',
        additionalLddAndHealthNeeds: [
          'Hearing impairment',
          'Mental health difficulty',
          'Social and emotional difficulties',
        ],
      },
    ],
  }
}
