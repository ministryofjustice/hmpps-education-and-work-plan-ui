import moment from 'moment/moment'
import type { InPrisonEducation } from 'viewModels'
import toInPrisonEducation from './inPrisonEducationMapper'
import {
  aValidEnglishLearnerEducation,
  aValidMathsLearnerEducation,
} from '../../testsupport/learnerEducationTestDataBuilder'

describe('inPrisonEducationMapper', () => {
  it('should map a Curious LearnerEducation to an InPrisonEducation view model given LearnerEducation does not have an actualEndDate value', () => {
    // Given
    const apiLearnerEducation = aValidEnglishLearnerEducation()

    const expectedInPrisonEducation: InPrisonEducation = {
      prisonId: 'MDI',
      prisonName: 'MOORLAND (HMP & YOI)',
      courseCode: '008ENGL06',
      courseName: 'GCSE English',
      courseStartDate: moment('2021-06-01').toDate(),
      courseCompleted: false,
      courseCompletionDate: null,
      source: 'CURIOUS',
    }

    // When
    const actual = toInPrisonEducation(apiLearnerEducation)

    // Then
    expect(actual).toEqual(expectedInPrisonEducation)
  })

  it('should map a Curious LearnerEducation to an InPrisonEducation view model given LearnerEducation has an actualEndDate value', () => {
    // Given
    const apiLearnerEducation = aValidMathsLearnerEducation()

    const expectedInPrisonEducation: InPrisonEducation = {
      prisonId: 'WDI',
      prisonName: 'WAKEFIELD (HMP)',
      courseCode: '246674',
      courseName: 'GCSE Maths',
      courseStartDate: moment('2016-05-18').toDate(),
      courseCompleted: true,
      courseCompletionDate: moment('2016-07-15').toDate(),
      source: 'CURIOUS',
    }

    // When
    const actual = toInPrisonEducation(apiLearnerEducation)

    // Then
    expect(actual).toEqual(expectedInPrisonEducation)
  })
})
