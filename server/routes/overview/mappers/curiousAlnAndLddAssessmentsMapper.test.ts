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
  describe('toCuriousAlnAndLddAssessments', () => {
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
            referral: [AlnAssessmentReferral.EDUCATION_SPECIALIST],
            additionalNeedsIdentified: true,
          }),
        ],
      })

      // When
      const actual = toCuriousAlnAndLddAssessments(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })

    it.each([
      { v1: null, v2: null },
      { v1: [], v2: null },
      { v1: [], v2: {} },
      { v1: [], v2: { assessments: null } },
      { v1: [], v2: { assessments: { aln: null } } },
      { v1: [], v2: { assessments: { aln: [] } } },
    ])('should map null or empty data from Curious to a CuriousAlnAndLddAssessments - %s', curiousAssessments => {
      // Given
      const curiousApiResponse = anAllAssessmentDTO({
        v1Assessments: curiousAssessments.v1,
        v2Assessments: curiousAssessments.v2,
      })

      const expected = validCuriousAlnAndLddAssessments({
        lddAssessments: [],
        alnAssessments: [],
      })

      // When
      const actual = toCuriousAlnAndLddAssessments(curiousApiResponse)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('Curious V1 LDD assessment mappings', () => {
    it('should map to CuriousAlnAndLddAssessments given v1 LDD assessment only has a primary name', () => {
      // Given
      const allAssessments = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            lddAssessments: [
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'MDI',
                lddPrimaryName: 'Visual impairment',
                lddSecondaryNames: null,
                inDepthAssessmentDate: null,
                rapidAssessmentDate: null,
              }),
            ],
          }),
        ],
        v2Assessments: null,
      })

      const expected = validCuriousAlnAndLddAssessments({
        lddAssessments: [
          aLddAssessment({
            prisonId: 'MDI',
            rapidAssessmentDate: null,
            inDepthAssessmentDate: null,
            primaryLddAndHealthNeed: 'Visual impairment',
            additionalLddAndHealthNeeds: [],
          }),
        ],
        alnAssessments: [],
      })

      // When
      const actual = toCuriousAlnAndLddAssessments(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to CuriousAlnAndLddAssessments given v1 LDD assessment only has secondary names', () => {
      // Given
      const allAssessments = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            lddAssessments: [
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'MDI',
                lddPrimaryName: null,
                lddSecondaryNames: ['Visual impairment'],
                inDepthAssessmentDate: null,
                rapidAssessmentDate: null,
              }),
            ],
          }),
        ],
        v2Assessments: null,
      })

      const expected = validCuriousAlnAndLddAssessments({
        lddAssessments: [
          aLddAssessment({
            prisonId: 'MDI',
            rapidAssessmentDate: null,
            inDepthAssessmentDate: null,
            primaryLddAndHealthNeed: null,
            additionalLddAndHealthNeeds: ['Visual impairment'],
          }),
        ],
        alnAssessments: [],
      })

      // When
      const actual = toCuriousAlnAndLddAssessments(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to CuriousAlnAndLddAssessments given v1 LDD assessment only has an indepth assessment date', () => {
      // Given
      const allAssessments = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            lddAssessments: [
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'MDI',
                lddPrimaryName: null,
                lddSecondaryNames: null,
                inDepthAssessmentDate: '2023-10-01',
                rapidAssessmentDate: null,
              }),
            ],
          }),
        ],
        v2Assessments: null,
      })

      const expected = validCuriousAlnAndLddAssessments({
        lddAssessments: [
          aLddAssessment({
            prisonId: 'MDI',
            rapidAssessmentDate: null,
            inDepthAssessmentDate: startOfDay('2023-10-01'),
            primaryLddAndHealthNeed: null,
            additionalLddAndHealthNeeds: [],
          }),
        ],
        alnAssessments: [],
      })

      // When
      const actual = toCuriousAlnAndLddAssessments(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to CuriousAlnAndLddAssessments given v1 LDD assessment only has a rapid assessment date', () => {
      // Given
      const allAssessments = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            lddAssessments: [
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'MDI',
                lddPrimaryName: null,
                lddSecondaryNames: null,
                inDepthAssessmentDate: null,
                rapidAssessmentDate: '2023-10-01',
              }),
            ],
          }),
        ],
        v2Assessments: null,
      })

      const expected = validCuriousAlnAndLddAssessments({
        lddAssessments: [
          aLddAssessment({
            prisonId: 'MDI',
            rapidAssessmentDate: startOfDay('2023-10-01'),
            inDepthAssessmentDate: null,
            primaryLddAndHealthNeed: null,
            additionalLddAndHealthNeeds: [],
          }),
        ],
        alnAssessments: [],
      })

      // When
      const actual = toCuriousAlnAndLddAssessments(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to CuriousAlnAndLddAssessments given v1 LDD assessment has no populated fields', () => {
      // Given
      const allAssessments = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            lddAssessments: [
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'MDI',
                lddPrimaryName: null,
                lddSecondaryNames: null,
                inDepthAssessmentDate: null,
                rapidAssessmentDate: null,
              }),
            ],
          }),
        ],
        v2Assessments: null,
      })

      const expected = validCuriousAlnAndLddAssessments({
        lddAssessments: [],
        alnAssessments: [],
      })

      // When
      const actual = toCuriousAlnAndLddAssessments(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('Curious V2 ALN assessment mappings', () => {
    it.each([
      { curiousValue: 'Healthcare', expected: [AlnAssessmentReferral.HEALTHCARE] },
      { curiousValue: 'Psychology', expected: [AlnAssessmentReferral.PSYCHOLOGY] },
      { curiousValue: 'Education Specialist', expected: [AlnAssessmentReferral.EDUCATION_SPECIALIST] },
      { curiousValue: 'NSM', expected: [AlnAssessmentReferral.NSM] },
      { curiousValue: 'Substance Misuse Team', expected: [AlnAssessmentReferral.SUBSTANCE_MISUSE_TEAM] },
      { curiousValue: 'Safer Custody', expected: [AlnAssessmentReferral.SAFER_CUSTODY] },
      { curiousValue: 'Other', expected: [AlnAssessmentReferral.OTHER] },
      {
        curiousValue: 'NSM, Other, Healthcare',
        expected: [AlnAssessmentReferral.NSM, AlnAssessmentReferral.OTHER, AlnAssessmentReferral.HEALTHCARE],
      },
      { curiousValue: null, expected: [] },
    ] as Array<{
      curiousValue:
        | 'Healthcare'
        | 'Psychology'
        | 'Education Specialist'
        | 'NSM'
        | 'Substance Misuse Team'
        | 'Safer Custody'
        | 'Other'
      expected: Array<AlnAssessmentReferral>
    }>)(
      'should correctly map Curious stakeholder referral value "$curiousValue" to "$expected"',
      ({ curiousValue, expected }) => {
        // Given
        const curiousApiResponse = anAllAssessmentDTO({
          v2Assessments: aLearnerAssessmentV2DTO({
            assessments: anExternalAssessmentsDTO({
              alnAssessments: [
                anAlnLearnerAssessmentsDTO({
                  stakeholderReferral: curiousValue,
                }),
              ],
            }),
          }),
        })

        // When
        const actual = toCuriousAlnAndLddAssessments(curiousApiResponse)

        // Then
        expect(actual.alnAssessments[0].referral).toEqual(expected)
      },
    )

    it.each([
      { curiousValue: 'Yes', expected: true },
      { curiousValue: 'No', expected: false },
    ] as Array<{
      curiousValue: 'Yes' | 'No'
      expected: boolean
    }>)(
      'should correctly map Curious assessmentOutcome value "$curiousValue" to additional needs identified "$expected"',
      ({ curiousValue, expected }) => {
        // Given
        const curiousApiResponse = anAllAssessmentDTO({
          v2Assessments: aLearnerAssessmentV2DTO({
            assessments: anExternalAssessmentsDTO({
              alnAssessments: [
                anAlnLearnerAssessmentsDTO({
                  assessmentOutcome: curiousValue,
                }),
              ],
            }),
          }),
        })

        // When
        const actual = toCuriousAlnAndLddAssessments(curiousApiResponse)

        // Then
        expect(actual.alnAssessments[0].additionalNeedsIdentified).toEqual(expected)
      },
    )
  })
})
