import moment from 'moment/moment'
import type { InductionResponse } from 'educationAndWorkPlanApiClient'
import type { EducationAndTraining } from 'viewModels'
import toEducationAndTraining from './educationAndTrainingMapper'
import {
  aLongQuestionSetInduction,
  aShortQuestionSetInduction,
} from '../../testsupport/inductionResponseTestDataBuilder'

describe('educationAndTrainingMapper', () => {
  it('should map to Education and Training given no Induction', () => {
    // Given
    const induction: InductionResponse = undefined

    const expected: EducationAndTraining = {
      problemRetrievingData: false,
      inductionQuestionSet: undefined,
      data: undefined,
    }

    // When
    const actual = toEducationAndTraining(induction)

    // Then
    expect(actual).toEqual(expected)
  })

  describe('Long question set Induction', () => {
    it('should map to Education and Training given Induction', () => {
      // Given
      const induction: InductionResponse = aLongQuestionSetInduction()

      const expected: EducationAndTraining = {
        problemRetrievingData: false,
        inductionQuestionSet: 'LONG_QUESTION_SET',
        data: {
          longQuestionSetAnswers: {
            updatedAt: moment('2023-06-19T09:39:44.000Z').toDate(),
            updatedBy: 'asmith_gen',
            highestEducationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS',
            additionalTraining: ['FIRST_AID_CERTIFICATE', 'MANUAL_HANDLING', 'OTHER'],
            otherAdditionalTraining: 'Advanced origami',
            educationalQualifications: [
              {
                subject: 'Pottery',
                grade: 'C',
                level: 'LEVEL_4',
              },
            ],
          },
          shortQuestionSetAnswers: undefined,
        },
      }

      // When
      const actual = toEducationAndTraining(induction)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('Short question set Induction', () => {
    it('should map to Education and Training given Induction', () => {
      // Given
      const induction: InductionResponse = aShortQuestionSetInduction()

      const expected: EducationAndTraining = {
        problemRetrievingData: false,
        inductionQuestionSet: 'SHORT_QUESTION_SET',
        data: {
          longQuestionSetAnswers: undefined,
          shortQuestionSetAnswers: {
            updatedAt: moment('2023-06-19T09:39:44.000Z').toDate(),
            updatedBy: 'asmith_gen',
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
            inPrisonInterestsEducation: {
              inPrisonInterestsEducation: ['CATERING', 'FORKLIFT_DRIVING', 'OTHER'],
              inPrisonInterestsEducationOther: 'Advanced origami',
              updatedAt: moment('2023-06-19T09:39:44.000Z').toDate(),
              updatedBy: 'asmith_gen',
            },
          },
        },
      }

      // When
      const actual = toEducationAndTraining(induction)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
