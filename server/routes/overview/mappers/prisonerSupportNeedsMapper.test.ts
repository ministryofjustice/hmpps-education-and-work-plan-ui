import { startOfDay } from 'date-fns'
import type { PrisonerSupportNeeds } from 'viewModels'
import toPrisonerSupportNeeds from './prisonerSupportNeedsMapper'
import {
  aLearnerLatestAssessmentV1DTO,
  aLearnerLddInfoExternalV1DTO,
  anAllAssessmentDTO,
} from '../../../testsupport/curiousAssessmentsTestDataBuilder'

describe('prisonerSupportNeedsMapper', () => {
  it('should map to PrisonerSupportNeeds', () => {
    // Given
    const allAssessments = anAllAssessmentDTO({
      v1Assessments: [
        aLearnerLatestAssessmentV1DTO({
          prisonNumber: 'G6123VU',
          lddAssessments: [
            aLearnerLddInfoExternalV1DTO({
              prisonId: 'MDI',
              rapidAssessmentDate: '2022-05-18',
              inDepthAssessmentDate: '2022-06-01',
              lddPrimaryName: 'Hearing impairment',
              lddSecondaryNames: null,
            }),
            aLearnerLddInfoExternalV1DTO({
              prisonId: 'DNI',
              rapidAssessmentDate: null,
              inDepthAssessmentDate: null,
              lddPrimaryName: null,
              lddSecondaryNames: [],
            }),
          ],
        }),
      ],
    })

    const expectedSupportNeeds: PrisonerSupportNeeds = {
      lddAssessments: [
        {
          prisonId: 'MDI',
          rapidAssessmentDate: startOfDay('2022-05-18'),
          inDepthAssessmentDate: startOfDay('2022-06-01'),
          primaryLddAndHealthNeeds: 'Hearing impairment',
          additionalLddAndHealthNeeds: [],
        },
      ],
    }

    // When
    const supportNeeds = toPrisonerSupportNeeds(allAssessments)

    // Then
    expect(supportNeeds).toEqual(expectedSupportNeeds)
  })
})
