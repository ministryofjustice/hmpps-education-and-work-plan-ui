import moment from 'moment/moment'
import type { CiagInduction } from 'ciagInductionApiClient'
import type { EducationAndTraining } from 'viewModels'
import toEducationAndTraining from './educationAndTrainingMapper'
import {
  aLongQuestionSetCiagInduction,
  aShortQuestionSetCiagInduction,
} from '../../testsupport/ciagInductionTestDataBuilder'

describe('educationAndTrainingMapper', () => {
  it('should map to Education and Training given no CIAG Induction', () => {
    // Given
    const ciagInduction: CiagInduction = undefined

    const expected: EducationAndTraining = {
      problemRetrievingData: false,
      inductionQuestionSet: undefined,
      data: undefined,
    }

    // When
    const actual = toEducationAndTraining(ciagInduction)

    // Then
    expect(actual).toEqual(expected)
  })

  describe('Long question set CIAG Induction', () => {
    it('should map to Education and Training given CIAG Induction', () => {
      // Given
      const ciagInduction: CiagInduction = aLongQuestionSetCiagInduction()

      const expected: EducationAndTraining = {
        problemRetrievingData: false,
        inductionQuestionSet: 'LONG_QUESTION_SET',
        data: {
          updatedAt: moment('2023-08-22T13:02:31.943Z').toDate(),
          updatedBy: 'ANOTHER_DPS_USER_GEN',
          longQuestionSetAnswers: {
            highestEducationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS',
            additionalTraining: ['FIRST_AID_CERTIFICATE', 'MANUAL_HANDLING', 'OTHER'],
            otherAdditionalTraining: 'Advanced origami',
          },
          shortQuestionSetAnswers: undefined,
        },
      }

      // When
      const actual = toEducationAndTraining(ciagInduction)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('Short question set CIAG Induction', () => {
    it('should map to Education and Training given CIAG Induction', () => {
      // Given
      const ciagInduction: CiagInduction = aShortQuestionSetCiagInduction()

      const expected: EducationAndTraining = {
        problemRetrievingData: false,
        inductionQuestionSet: 'SHORT_QUESTION_SET',
        data: {
          updatedAt: moment('2023-08-22T13:02:31.943Z').toDate(),
          updatedBy: 'ANOTHER_DPS_USER_GEN',
          longQuestionSetAnswers: undefined,
          shortQuestionSetAnswers: {
            additionalTraining: ['FULL_UK_DRIVING_LICENCE', 'OTHER'],
            otherAdditionalTraining: 'Beginners cookery for IT professionals',
            educationalQualifications: [
              {
                subject: 'English',
                grade: 'C',
                level: 'LEVEL_6',
              },
              {
                subject: 'Maths',
                grade: 'A*',
                level: 'LEVEL_6',
              },
            ],
          },
        },
      }

      // When
      const actual = toEducationAndTraining(ciagInduction)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
