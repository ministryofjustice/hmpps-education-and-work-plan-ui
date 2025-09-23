import { startOfDay } from 'date-fns'
import {
  toInPrisonCourseFromLearnerEducationDTO,
  toCourseStatus,
  toInPrisonCourseFromLearnerQualificationsDTO,
} from './inPrisonCourseMapper'
import { aLearnerEducationDTO, aLearnerQualificationsDTO } from '../../testsupport/curiousQualificationsTestDataBuilder'
import { aValidInPrisonCourse } from '../../testsupport/inPrisonCourseTestDataBuilder'

describe('inPrisonCourseMapper', () => {
  describe('toInPrisonCourseFromLearnerEducationDTO', () => {
    it('should map a Curious 1 LearnerEducationDTO to an InPrisonCourse', () => {
      // Given
      const apiLearnerEducation = aLearnerEducationDTO()

      const expectedInPrisonCourse = aValidInPrisonCourse({
        prisonId: 'BXI',
        courseCode: '101448',
        courseName: 'Certificate of Management',
        courseStartDate: startOfDay('2023-10-13'),
        courseStatus: 'COMPLETED',
        courseCompletionDate: startOfDay('2024-01-24'),
        coursePlannedEndDate: startOfDay('2023-12-29'),
        isAccredited: true,
        grade: 'Achieved',
        withdrawalReason: null,
        source: 'CURIOUS1',
      })

      // When
      const actual = toInPrisonCourseFromLearnerEducationDTO(apiLearnerEducation)

      // Then
      expect(actual).toEqual(expectedInPrisonCourse)
    })
  })

  describe('toInPrisonCourseFromLearnerQualificationsDTO', () => {
    it('should map a Curious 2 LearnerQualificationsDTO to an InPrisonCourse', () => {
      // Given
      const apiLearnerQualification = aLearnerQualificationsDTO()

      const expectedInPrisonCourse = aValidInPrisonCourse({
        prisonId: 'BXI',
        courseCode: '270828',
        courseName: 'CIMA Strategic Level',
        courseStartDate: startOfDay('2024-06-01'),
        courseStatus: 'IN_PROGRESS',
        courseCompletionDate: null,
        coursePlannedEndDate: startOfDay('2024-06-30'),
        isAccredited: true,
        grade: null,
        withdrawalReason: null,
        source: 'CURIOUS2',
      })

      // When
      const actual = toInPrisonCourseFromLearnerQualificationsDTO(apiLearnerQualification)

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
