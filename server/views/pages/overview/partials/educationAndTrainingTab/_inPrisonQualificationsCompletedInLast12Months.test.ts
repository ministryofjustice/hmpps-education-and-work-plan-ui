import * as cheerio from 'cheerio'
import { format, startOfToday, subMonths } from 'date-fns'
import nunjucks from 'nunjucks'
import type { InPrisonCourse } from 'viewModels'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDate from '../../../../../filters/formatDateFilter'
import validInPrisonCourseRecords from '../../../../../testsupport/inPrisonCourseRecordsTestDataBuilder'
import formatIsAccreditedFilter from '../../../../../filters/formatIsAccreditedFilter'
import { Result } from '../../../../../utils/result/result'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDate)
  .addFilter('formatIsAccredited', formatIsAccreditedFilter)

const prisonerSummary = aValidPrisonerSummary()
const prisonNamesById = { WDI: 'Wakefield (HMP)' }
const inPrisonCourses = Result.fulfilled(validInPrisonCourseRecords())
const templateParams = {
  prisonerSummary,
  prisonNamesById,
  inPrisonCourses,
}
const template = '_inPrisonQualificationsCompletedInLast12Months.njk'

describe('Education and Training tab view - In Prison Qualifications Completed In Last 12 Months', () => {
  const today = startOfToday()
  const eighteenMonthsAgo = subMonths(today, 18)
  const thirteenMonthsAgo = subMonths(today, 13)
  const nineMonthsAgo = subMonths(today, 9)

  it('should render In Prison Qualifications table', () => {
    // Given
    const params = {
      ...templateParams,
      inPrisonCourses: Result.fulfilled({
        totalRecords: 2,
        coursesByStatus: {
          WITHDRAWN: [] as Array<InPrisonCourse>,
          TEMPORARILY_WITHDRAWN: [] as Array<InPrisonCourse>,
          IN_PROGRESS: [] as Array<InPrisonCourse>,
          COMPLETED: [
            {
              prisonId: 'WDI',
              prisonName: 'Wakefield (HMP)',
              courseName: 'GCSE Maths',
              courseCode: '246674',
              isAccredited: true,
              courseStartDate: eighteenMonthsAgo,
              courseStatus: 'COMPLETED',
              courseCompletionDate: thirteenMonthsAgo,
              grade: 'A*',
              source: 'CURIOUS',
            },
            {
              prisonId: 'WDI',
              prisonName: 'Wakefield (HMP)',
              courseName: 'GCSE English',
              courseCode: '146675',
              isAccredited: true,
              courseStartDate: eighteenMonthsAgo,
              courseStatus: 'COMPLETED',
              courseCompletionDate: nineMonthsAgo,
              grade: 'C',
              source: 'CURIOUS',
            },
          ],
        },
        coursesCompletedInLast12Months: [
          {
            prisonId: 'WDI',
            prisonName: 'Wakefield (HMP)',
            courseName: 'GCSE English',
            courseCode: '146675',
            isAccredited: true,
            courseStartDate: eighteenMonthsAgo,
            courseStatus: 'COMPLETED',
            courseCompletionDate: nineMonthsAgo,
            grade: 'C',
            source: 'CURIOUS',
          },
        ],
      }),
    }

    const expectedCourseCompletionDate = format(nineMonthsAgo, 'd MMMM yyyy')

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('#completed-in-prison-courses-in-last-12-months-table tbody tr').length).toBe(1)
    expect($('#completed-in-prison-courses-in-last-12-months-table tbody tr td:nth-child(1)').text().trim()).toEqual(
      'GCSE English',
    ) // Course name
    expect($('#completed-in-prison-courses-in-last-12-months-table tbody tr td:nth-child(2)').text().trim()).toEqual(
      'Accredited',
    ) // Course type (accredited or non-accredited)
    expect($('#completed-in-prison-courses-in-last-12-months-table tbody tr td:nth-child(3)').text().trim()).toEqual(
      'Wakefield (HMP)',
    ) // Location
    expect($('#completed-in-prison-courses-in-last-12-months-table tbody tr td:nth-child(4)').text().trim()).toEqual(
      expectedCourseCompletionDate,
    ) // Course completion date
    expect($('#completed-in-prison-courses-in-last-12-months-table tbody tr td:nth-child(5)').text().trim()).toEqual(
      'C',
    ) // Grade
    expect($('[data-qa=view-all-in-prison-courses-link]').length).toEqual(1)
  })

  it('should render content saying curious is unavailable given problem retrieving data is true', () => {
    // Given
    const params = {
      ...templateParams,
      inPrisonCourses: Result.rejected(new Error('Failed to retrieve in prison courses')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    expect($('[data-qa="curious-unavailable-message"]').text().trim()).toEqual(
      'We cannot show these details from Curious right now',
    )
  })

  it('should render message if prisoner has no In Prison Courses completed in the last 12 months', () => {
    // Given
    const params = {
      ...templateParams,
      inPrisonCourses: Result.fulfilled({
        ...validInPrisonCourseRecords(),
        totalRecords: 0,
        coursesCompletedInLast12Months: [] as Array<InPrisonCourse>,
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('#completed-in-prison-courses-in-last-12-months-table tbody tr').length).toBe(1)
    expect($('#completed-in-prison-courses-in-last-12-months-table tbody tr td').length).toBe(1)
    expect($('#completed-in-prison-courses-in-last-12-months-table tbody tr td').text().trim()).toEqual(
      'No courses or qualifications completed in last 12 months.',
    )
    expect($('[data-qa=view-all-in-prison-courses-link]').length).toEqual(0)
  })
})
