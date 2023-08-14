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
    const apiLearnerEducation = { ...aValidEnglishLearnerEducation() }
    apiLearnerEducation.learningActualEndDate = null

    const expectedInPrisonEducation: InPrisonEducation = {
      prisonId: 'MDI',
      prisonName: 'MOORLAND (HMP & YOI)',
      courseCode: '008ENGL06',
      courseName: 'GCSE English',
      courseStartDate: moment('2021-06-01').toDate(),
      courseCompleted: false, // expect courseCompleted to be false because there is no value for learningActualEndDate
      courseCompletionDate: null,
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
      courseCompleted: true, // expect courseCompleted to be true because there is a value for learningActualEndDate
      courseCompletionDate: moment('2016-07-15').toDate(),
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
      courseCompleted: true,
      courseCompletionDate: moment('2016-07-15').toDate(),
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
      courseCompleted: true,
      courseCompletionDate: moment('2016-07-15').toDate(),
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
      courseCompleted: true,
      courseCompletionDate: moment('2016-07-15').toDate(),
      grade: null, // expect grade to be null (because there is no outcome grade or outcome)
      source: 'CURIOUS',
    }

    // When
    const actual = toInPrisonEducation(apiLearnerEducation)

    // Then
    expect(actual).toEqual(expectedInPrisonEducation)
  })
})
