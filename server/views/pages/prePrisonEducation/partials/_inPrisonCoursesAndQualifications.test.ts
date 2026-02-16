import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import formatDateFilter from '../../../../filters/formatDateFilter'
import { Result } from '../../../../utils/result/result'
import validInPrisonCourseRecords from '../../../../testsupport/inPrisonCourseRecordsTestDataBuilder'
import {
  aValidEnglishInPrisonCourse,
  aValidEnglishInPrisonCourseCompletedWithinLast12Months,
  aValidMathsInPrisonCourse,
} from '../../../../testsupport/inPrisonCourseTestDataBuilder'
import formatIsAccreditedFilter from '../../../../filters/formatIsAccreditedFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatIsAccredited', formatIsAccreditedFilter)

const template = './_inPrisonCoursesAndQualifications.njk'

const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }
const inPrisonCourses = Result.fulfilled(validInPrisonCourseRecords())
const templateParams = {
  inPrisonCourses,
  prisonNamesById,
}

describe('_inPrisonCoursesAndQualifications', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render given prisoner has some completed in prison courses', () => {
    // Given
    const params = {
      ...templateParams,
      inPrisonCourses: Result.fulfilled(
        validInPrisonCourseRecords({
          completedCourses: [aValidMathsInPrisonCourse(), aValidEnglishInPrisonCourseCompletedWithinLast12Months()],
          inProgressCourses: [aValidEnglishInPrisonCourse()],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const inPrisonCoursesTable = $('[data-qa=in-prison-courses-table]')
    expect(inPrisonCoursesTable.length).toEqual(1)
    expect(inPrisonCoursesTable.find('tbody tr').length).toEqual(2)
    expect(inPrisonCoursesTable.find('tbody tr').eq(0).find('td').eq(0).text().trim()).toEqual('GCSE English')
    expect(inPrisonCoursesTable.find('tbody tr').eq(1).find('td').eq(0).text().trim()).toEqual('GCSE Maths')
    expect($('[data-qa=no-in-prison-courses]').length).toEqual(0)
    expect($('[data-qa=in-prison-courses-curious-unavailable-message]').length).toEqual(0)
  })

  it('should render given prisoner has not completed any in prison courses', () => {
    // Given
    const params = {
      ...templateParams,
      inPrisonCourses: Result.fulfilled(
        validInPrisonCourseRecords({
          completedCourses: [],
          inProgressCourses: [aValidEnglishInPrisonCourse()],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=in-prison-courses-table]').length).toEqual(0)
    expect($('[data-qa=no-in-prison-courses]').length).toEqual(1)
    expect($('[data-qa=in-prison-courses-curious-unavailable-message]').length).toEqual(0)
  })

  it('should render Curious unavailable message given Curious API has failed to retrieve in prison courses', () => {
    // Given
    const params = {
      ...templateParams,
      inPrisonCourses: Result.rejected(new Error('Failed to get Curious In-Prison Courses')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=in-prison-courses-table]').length).toEqual(0)
    expect($('[data-qa=no-in-prison-courses]').length).toEqual(0)
    expect($('[data-qa=in-prison-courses-curious-unavailable-message]').length).toEqual(1)
  })
})
