import moment from 'moment/moment'
import type { InPrisonEducation } from 'viewModels'
import { toInPrisonEducation, toCourseStatus } from './inPrisonEducationMapper'
import {
  aValidEnglishLearnerEducation,
  aValidMathsLearnerEducation,
} from '../../testsupport/learnerEducationTestDataBuilder'

describe('inPrisonEducationMapper', () => {
  describe('toInPrisonEducation', () => {
    it('should map a Curious LearnerEducation to an InPrisonEducation view model given LearnerEducation does not have an actualEndDate value', () => {
      // Given
      const apiLearnerEducation = { ...aValidEnglishLearnerEducation() }

      const expectedInPrisonEducation: InPrisonEducation = {
        prisonId: 'MDI',
        prisonName: 'MOORLAND (HMP & YOI)',
        courseCode: '008ENGL06',
        courseName: 'GCSE English',
        courseStartDate: moment('2021-06-01').toDate(),
        courseStatus: 'IN_PROGRESS',
        courseCompletionDate: null,
        isAccredited: false,
        grade: null,
        source: 'CURIOUS',
      }

      // When
      const actual = toInPrisonEducation(apiLearnerEducation)

      // Then
      expect(actual).toEqual(expectedInPrisonEducation)
    })

    it('should map a Curious LearnerEducation to an InPrisonEducation view model given LearnerEducation has an actualEndDate value', () => {
      // Given
      const apiLearnerEducation = { ...aValidMathsLearnerEducation() }
      apiLearnerEducation.learningActualEndDate = '2016-07-15'
      apiLearnerEducation.outcome = undefined
      apiLearnerEducation.outcomeGrade = undefined

      const expectedInPrisonEducation: InPrisonEducation = {
        prisonId: 'WDI',
        prisonName: 'WAKEFIELD (HMP)',
        courseCode: '246674',
        courseName: 'GCSE Maths',
        courseStartDate: moment('2016-05-18').toDate(),
        courseStatus: 'WITHDRAWN',
        courseCompletionDate: moment('2016-07-15').toDate(),
        isAccredited: true,
        grade: null,
        source: 'CURIOUS',
      }

      // When
      const actual = toInPrisonEducation(apiLearnerEducation)

      // Then
      expect(actual).toEqual(expectedInPrisonEducation)
    })

    it('should map a Curious LearnerEducation to an InPrisonEducation view model given LearnerEducation has an outcome and outcome grade', () => {
      // Given
      const apiLearnerEducation = { ...aValidMathsLearnerEducation() }
      apiLearnerEducation.outcome = 'Passed'
      apiLearnerEducation.outcomeGrade = 'A'

      const expectedInPrisonEducation: InPrisonEducation = {
        prisonId: 'WDI',
        prisonName: 'WAKEFIELD (HMP)',
        courseCode: '246674',
        courseName: 'GCSE Maths',
        courseStartDate: moment('2016-05-18').toDate(),
        courseStatus: 'WITHDRAWN',
        courseCompletionDate: moment('2016-07-15').toDate(),
        isAccredited: true,
        grade: 'A', // expect grade to be the value of outcomeGrade (as preference over outcome)
        source: 'CURIOUS',
      }

      // When
      const actual = toInPrisonEducation(apiLearnerEducation)

      // Then
      expect(actual).toEqual(expectedInPrisonEducation)
    })

    it('should map a Curious LearnerEducation to an InPrisonEducation view model given LearnerEducation has an outcome but no outcome grade', () => {
      // Given
      const apiLearnerEducation = { ...aValidMathsLearnerEducation() }
      apiLearnerEducation.outcome = 'Passed'
      apiLearnerEducation.outcomeGrade = undefined

      const expectedInPrisonEducation: InPrisonEducation = {
        prisonId: 'WDI',
        prisonName: 'WAKEFIELD (HMP)',
        courseCode: '246674',
        courseName: 'GCSE Maths',
        courseStartDate: moment('2016-05-18').toDate(),
        courseStatus: 'WITHDRAWN',
        courseCompletionDate: moment('2016-07-15').toDate(),
        isAccredited: true,
        grade: 'Passed', // expect grade to be the value of outcome (because there is no outcome grade)
        source: 'CURIOUS',
      }

      // When
      const actual = toInPrisonEducation(apiLearnerEducation)

      // Then
      expect(actual).toEqual(expectedInPrisonEducation)
    })

    it('should map a Curious LearnerEducation to an InPrisonEducation view model given LearnerEducation has neither outcome or outcome grade', () => {
      // Given
      const apiLearnerEducation = { ...aValidMathsLearnerEducation() }
      apiLearnerEducation.outcome = undefined
      apiLearnerEducation.outcomeGrade = undefined

      const expectedInPrisonEducation: InPrisonEducation = {
        prisonId: 'WDI',
        prisonName: 'WAKEFIELD (HMP)',
        courseCode: '246674',
        courseName: 'GCSE Maths',
        courseStartDate: moment('2016-05-18').toDate(),
        courseStatus: 'WITHDRAWN',
        courseCompletionDate: moment('2016-07-15').toDate(),
        isAccredited: true,
        grade: null, // expect grade to be null (because there is no outcome grade or outcome)
        source: 'CURIOUS',
      }

      // When
      const actual = toInPrisonEducation(apiLearnerEducation)

      // Then
      expect(actual).toEqual(expectedInPrisonEducation)
    })
  })

  describe('toCourseStatus', () => {
    Array.of(
      {
        curiousScreenLabel:
          'The learner is continuing or intending to continue the learning activities leading to the learning aim',
        expected: 'IN_PROGRESS',
      },
      {
        curiousScreenLabel: 'The learner has completed the learning activities leading to the learning aim',
        expected: 'COMPLETED',
      },
      {
        curiousScreenLabel: 'The learner has withdrawn from the learning activities leading to the learning aim',
        expected: 'WITHDRAWN',
      },
      {
        curiousScreenLabel: 'Learner has temporarily withdrawn from the aim due to an agreed break in learning',
        expected: 'TEMPORARILY_WITHDRAWN',
      },
    ).forEach(spec => {
      it(`should map '${spec.curiousScreenLabel}' to '${spec.expected}'`, () => {
        // Given

        // When
        const actual = toCourseStatus(spec.curiousScreenLabel)

        // Then
        expect(actual).toEqual(spec.expected)
      })
    })
  })
})
