import { startOfDay } from 'date-fns'
import type { AllAssessmentDTO, LearnerProfile } from 'curiousApiClient'
import type { Assessment } from 'viewModels'
import {
  aLearnerAssessmentV1DTO,
  aLearnerLatestAssessmentV1DTO,
  anAllAssessmentDTO,
} from '../../../testsupport/curiousAssessmentsTestDataBuilder'
import { aValidCurious1Assessment } from '../../../testsupport/assessmentTestDataBuilder'
import {
  toCurious1AssessmentsFromAllAssessmentDTO,
  toCurious1AssessmentsFromLearnerProfiles,
} from './curious1AssessmentMapper'

describe('curious1AssessmentMapper', () => {
  describe('toCurious1AssessmentsFromAllAssessmentDTO', () => {
    it('should map to Assessments given AllAssessmentDTO contains v1 assessments', () => {
      // Given
      const prisonNumber = 'G6123VU'
      const allAssessments = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            prisonNumber,
            qualifications: [
              aLearnerAssessmentV1DTO({
                prisonId: 'MDI',
                qualificationType: 'English',
                qualificationGrade: 'Level 1',
                assessmentDate: '2012-02-16',
              }),
              aLearnerAssessmentV1DTO({
                prisonId: 'MDI',
                qualificationType: 'Maths',
                qualificationGrade: 'Level 2',
                assessmentDate: '2012-02-18',
              }),
            ],
          }),
          aLearnerLatestAssessmentV1DTO({
            prisonNumber,
            qualifications: [
              aLearnerAssessmentV1DTO({
                prisonId: 'DNI',
                qualificationType: 'Digital Literacy',
                qualificationGrade: 'Level 3',
                assessmentDate: '2022-08-29',
              }),
            ],
          }),
        ],
      })

      const expected = [
        aValidCurious1Assessment({
          assessmentDate: startOfDay('2012-02-16'),
          level: 'Level 1',
          prisonId: 'MDI',
          type: 'ENGLISH',
        }),
        aValidCurious1Assessment({
          assessmentDate: startOfDay('2012-02-18'),
          level: 'Level 2',
          prisonId: 'MDI',
          type: 'MATHS',
        }),
        aValidCurious1Assessment({
          assessmentDate: startOfDay('2022-08-29'),
          level: 'Level 3',
          prisonId: 'DNI',
          type: 'DIGITAL_LITERACY',
        }),
      ]

      // When
      const actual = toCurious1AssessmentsFromAllAssessmentDTO(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to Assessments given null AllAssessmentDTO', () => {
      // Given
      const allAssessments: AllAssessmentDTO = null

      const expected = [] as Array<Assessment>

      // When
      const actual = toCurious1AssessmentsFromAllAssessmentDTO(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to Assessments given AllAssessmentDTO contains no v1 assessments', () => {
      // Given
      const allAssessments = anAllAssessmentDTO({
        v1Assessments: null,
      })

      const expected = [] as Array<Assessment>

      // When
      const actual = toCurious1AssessmentsFromAllAssessmentDTO(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to Assessments given AllAssessmentDTO contains no v1 assessment qualifications', () => {
      // Given
      const allAssessments = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            qualifications: null,
          }),
        ],
      })

      const expected = [] as Array<Assessment>

      // When
      const actual = toCurious1AssessmentsFromAllAssessmentDTO(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('toCurious1AssessmentsFromLearnerProfiles', () => {
    it('should map to Assessments given LearnerProfiles', () => {
      // Given
      const prisonNumber = 'G6123VU'
      const learnerProfiles: Array<LearnerProfile> = [
        {
          prn: prisonNumber,
          establishmentId: 'MDI',
          establishmentName: 'MOORLAND (HMP & YOI)',
          qualifications: [
            {
              qualificationType: 'English',
              qualificationGrade: 'Level 1',
              assessmentDate: '2012-02-16',
            },
            {
              qualificationType: 'Maths',
              qualificationGrade: 'Level 2',
              assessmentDate: '2012-02-18',
            },
          ],
        },
        {
          prn: prisonNumber,
          establishmentId: 'DNI',
          establishmentName: 'DONCASTER (HMP)',
          qualifications: [
            {
              qualificationType: 'Digital Literacy',
              qualificationGrade: 'Level 3',
              assessmentDate: '2022-08-29',
            },
          ],
        },
      ]

      const expected = [
        aValidCurious1Assessment({
          assessmentDate: startOfDay('2012-02-16'),
          level: 'Level 1',
          prisonId: 'MDI',
          type: 'ENGLISH',
        }),
        aValidCurious1Assessment({
          assessmentDate: startOfDay('2012-02-18'),
          level: 'Level 2',
          prisonId: 'MDI',
          type: 'MATHS',
        }),
        aValidCurious1Assessment({
          assessmentDate: startOfDay('2022-08-29'),
          level: 'Level 3',
          prisonId: 'DNI',
          type: 'DIGITAL_LITERACY',
        }),
      ]

      // When
      const actual = toCurious1AssessmentsFromLearnerProfiles(learnerProfiles)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to Assessments given no LearnerProfiles', () => {
      // Given
      const learnerProfiles: Array<LearnerProfile> = []

      const expected = [] as Array<Assessment>

      // When
      const actual = toCurious1AssessmentsFromLearnerProfiles(learnerProfiles)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to Assessments given null LearnerProfiles', () => {
      // Given
      const learnerProfiles: Array<LearnerProfile> = null

      const expected = [] as Array<Assessment>

      // When
      const actual = toCurious1AssessmentsFromLearnerProfiles(learnerProfiles)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
