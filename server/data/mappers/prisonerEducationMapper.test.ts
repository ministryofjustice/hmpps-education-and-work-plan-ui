import moment from 'moment/moment'
import type { PrisonerEducation } from 'viewModels'
import toPrisonerEducation from './prisonerEducationMapper'
import { aValidEnglishLearnerEducation } from '../../testsupport/learnerEducationTestDataBuilder'

describe('prisonerEducationMapper', () => {
  it('should map a Curious LearnerEducation to a PrisonerEducation view model', () => {
    // Given
    const apiLearnerEducation = aValidEnglishLearnerEducation()

    const expectedPrisonerEducation: PrisonerEducation = {
      prisonId: 'MDI',
      prisonName: 'MOORLAND (HMP & YOI)',
      courseCode: '008ENGL06',
      courseName: 'GCSE English',
      courseStartDate: moment('2021-06-01').toDate(),
      source: 'CURIOUS',
    }

    // When
    const actual = toPrisonerEducation(apiLearnerEducation)

    // Then
    expect(actual).toEqual(expectedPrisonerEducation)
  })
})
