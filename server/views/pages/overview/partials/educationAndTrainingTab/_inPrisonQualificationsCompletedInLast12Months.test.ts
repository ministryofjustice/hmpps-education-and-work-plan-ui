import * as fs from 'fs'
import * as cheerio from 'cheerio'
import { format, startOfToday, subMonths } from 'date-fns'
import nunjucks, { Template } from 'nunjucks'
import { registerNunjucks } from '../../../../../utils/nunjucksSetup'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('Education and Training tab view - In Prison Qualifications Completed In Last 12 Months', () => {
  const template = fs.readFileSync(
    'server/views/pages/overview/partials/educationAndTrainingTab/_inPrisonQualificationsCompletedInLast12Months.njk',
  )
  const prisonerSummary = aValidPrisonerSummary()

  let compiledTemplate: Template
  let viewContext: Record<string, unknown>

  const njkEnv = registerNunjucks()

  const today = startOfToday()
  const eighteenMonthsAgo = subMonths(today, 18)
  const thirteenMonthsAgo = subMonths(today, 13)
  const nineMonthsAgo = subMonths(today, 9)

  beforeEach(() => {
    compiledTemplate = nunjucks.compile(template.toString(), njkEnv)
  })

  it('should render In Prison Qualifications table', () => {
    // Given
    viewContext = {
      prisonerSummary,
      tab: 'education-and-training',
      inPrisonCourses: {
        problemRetrievingData: false,
        totalRecords: 2,
        coursesByStatus: {
          WITHDRAWN: [],
          TEMPORARILY_WITHDRAWN: [],
          IN_PROGRESS: [],
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
      },
    }

    const expectedCourseCompletionDate = format(nineMonthsAgo, 'd MMMM yyyy')

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

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
  })

  it('should render content saying curious is unavailable given problem retrieving data is true', () => {
    // Given
    viewContext = {
      prisonerSummary,
      tab: 'education-and-training',
      inPrisonCourses: {
        problemRetrievingData: true,
      },
    }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    expect($('[data-qa="curious-unavailable-message"]').text().trim()).toEqual(
      'We cannot show these details from Curious right now',
    )
  })

  it('should render message if prisoner has no In Prison Courses completed in the last 12 months', () => {
    viewContext = {
      prisonerSummary,
      tab: 'education-and-training',
      inPrisonCourses: {
        problemRetrievingData: false,
        totalRecords: 0,
        coursesByStatus: {
          WITHDRAWN: [],
          TEMPORARILY_WITHDRAWN: [],
          IN_PROGRESS: [],
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
          ],
        },
        coursesCompletedInLast12Months: [],
      },
    }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    expect($('#completed-in-prison-courses-in-last-12-months-table tbody tr').length).toBe(1)
    expect($('#completed-in-prison-courses-in-last-12-months-table tbody tr td').length).toBe(1)
    expect($('#completed-in-prison-courses-in-last-12-months-table tbody tr td').text().trim()).toEqual(
      'No courses or qualifications completed in last 12 months.',
    )
  })
})
