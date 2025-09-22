import { startOfDay } from 'date-fns'
import toCuriousAlnAndLddAssessments from './curiousAlnAndLddAssessmentsMapper'
import {
  aLearnerAssessmentV2DTO,
  aLearnerLatestAssessmentV1DTO,
  aLearnerLddInfoExternalV1DTO,
  anAllAssessmentDTO,
  anAlnLearnerAssessmentsDTO,
  anExternalAssessmentsDTO,
} from '../../../testsupport/curiousAssessmentsTestDataBuilder'
import {
  anAlnAssessment,
  aLddAssessment,
  validCuriousAlnAndLddAssessments,
} from '../../../testsupport/curiousAlnAndLddAssessmentsTestDataBuilder'
import AlnAssessmentReferral from '../../../enums/alnAssessmentReferral'

describe('curiousAlnAndLddAssessmentsMapper', () => {
  it('should map to CuriousAlnAndLddAssessments', () => {
    // Given
    const allAssessments = anAllAssessmentDTO({
      v1Assessments: [
        aLearnerLatestAssessmentV1DTO({
          lddAssessments: [
            aLearnerLddInfoExternalV1DTO({
              prisonId: 'MDI',
              lddPrimaryName: 'Visual impairment',
              lddSecondaryNames: [
                'Hearing impairment',
                'Mental health difficulty',
                'Social and emotional difficulties',
              ],
              inDepthAssessmentDate: '2013-02-16',
              rapidAssessmentDate: '2012-02-16',
            }),
          ],
        }),
      ],
      v2Assessments: aLearnerAssessmentV2DTO({
        assessments: anExternalAssessmentsDTO({
          alnAssessments: [
            anAlnLearnerAssessmentsDTO({
              prisonId: 'MDI',
              assessmentDate: '2025-10-01',
              assessmentOutcome: 'Yes',
              hasPrisonerConsent: 'Yes',
              stakeholderReferral: 'Education Specialist',
            }),
          ],
        }),
      }),
    })

    const expected = validCuriousAlnAndLddAssessments({
      lddAssessments: [
        aLddAssessment({
          prisonId: 'MDI',
          rapidAssessmentDate: startOfDay('2012-02-16'),
          inDepthAssessmentDate: startOfDay('2013-02-16'),
          primaryLddAndHealthNeed: 'Visual impairment',
          additionalLddAndHealthNeeds: [
            'Hearing impairment',
            'Mental health difficulty',
            'Social and emotional difficulties',
          ],
        }),
      ],
      alnAssessments: [
        anAlnAssessment({
          prisonId: 'MDI',
          assessmentDate: startOfDay('2025-10-01'),
          referral: AlnAssessmentReferral.EDUCATION_SPECIALIST,
          additionalNeedsIdentified: true,
        }),
      ],
    })

    // When
    const actual = toCuriousAlnAndLddAssessments(allAssessments)

    // Then
    expect(actual).toEqual(expected)
  })
})
