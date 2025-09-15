import { parseISO, startOfDay } from 'date-fns'
import type { InPrisonCourse } from 'viewModels'
import { toInPrisonCourse, toCourseStatus } from './inPrisonCourseMapper'
import { aLearnerEducationDTO } from '../../testsupport/curiousQualificationsTestDataBuilder'

describe('inPrisonCourseMapper', () => {
  describe('toInPrisonCourse', () => {
    it('should map a Curious LearnerEducationDTO to an InPrisonCourse', () => {
      // Given
      const apiLearnerEducation = aLearnerEducationDTO()

      const expectedInPrisonCourse: InPrisonCourse = {
        prisonId: 'BXI',
        courseCode: '101448',
        courseName: 'Certificate of Management',
        courseStartDate: startOfDay(parseISO('2023-10-13')),
        courseStatus: 'COMPLETED',
        courseCompletionDate: startOfDay(parseISO('2024-01-24')),
        coursePlannedEndDate: startOfDay(parseISO('2023-12-29')),
        isAccredited: true,
        grade: 'Achieved',
        withdrawalReason: null,
        source: 'CURIOUS',
      }

      // When
      const actual = toInPrisonCourse(apiLearnerEducation)

      // Then
      expect(actual).toEqual(expectedInPrisonCourse)
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
