import * as fs from 'fs'
import cheerio from 'cheerio'
import moment from 'moment'
import nunjucks, { Template } from 'nunjucks'
import { registerNunjucks } from '../../../../../utils/nunjucksSetup'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('Education and Training tab view - In Prison Qualifications', () => {
  const template = fs.readFileSync(
    'server/views/pages/overview/partials/educationAndTrainingTab/_inPrisonQualifications.njk',
  )
  const prisonerSummary = aValidPrisonerSummary()

  let compiledTemplate: Template
  let viewContext: Record<string, unknown>

  const njkEnv = registerNunjucks()

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
        totalRecords: 1,
        coursesByStatus: {
          WITHDRAWN: [],
          TEMPORARILY_WITHDRAWN: [],
          IN_PROGRESS: [],
          COMPLETED: [
            {
              prisonId: 'WDI',
              prisonName: 'WAKEFIELD (HMP)',
              courseName: 'GCSE Maths',
              courseCode: '246674',
              courseStartDate: moment('2016-05-18').toDate(),
              courseStatus: 'COMPLETED',
              courseCompletionDate: moment('2016-07-15').toDate(),
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
    expect($('#completed-in-prison-qualifications-table tbody tr').length).toBe(1)
    expect($('#completed-in-prison-qualifications-table tbody tr td').length).toBe(3)
    expect($('#completed-in-prison-qualifications-table tbody tr td:nth-child(1)').text()).toContain('GCSE Maths')
    expect($('#completed-in-prison-qualifications-table tbody tr td:nth-child(2)').text()).toContain('15 July 2016')
    expect($('#completed-in-prison-qualifications-table tbody tr td:nth-child(3)').text()).toContain('A*')
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

    expect($('[data-qa="curious-unavailable-message"]').text()).toContain(
      'We cannot show these details from Curious right now',
    )
  })

  it('should render grade if present for an In Prison Qualification', () => {
    viewContext = {
      prisonerSummary,
      tab: 'education-and-training',
      inPrisonCourses: {
        problemRetrievingData: false,
        totalRecords: 1,
        coursesByStatus: {
          WITHDRAWN: [],
          TEMPORARILY_WITHDRAWN: [],
          IN_PROGRESS: [],
          COMPLETED: [
            {
              prisonId: 'WDI',
              prisonName: 'WAKEFIELD (HMP)',
              courseName: 'GCSE Maths',
              courseCode: '246674',
              courseStartDate: moment('2016-05-18').toDate(),
              courseStatus: 'COMPLETED',
              courseCompletionDate: moment('2016-07-15').toDate(),
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
    expect($('#completed-in-prison-qualifications-table tbody tr').length).toBe(1)
    expect($('#completed-in-prison-qualifications-table tbody tr td:nth-child(3)').text()).toContain('A*')
  })

  it('should render N/A if grade not present for an In Prison Qualification', () => {
    viewContext = {
      prisonerSummary,
      tab: 'education-and-training',
      inPrisonCourses: {
        problemRetrievingData: false,
        totalRecords: 1,
        coursesByStatus: {
          WITHDRAWN: [],
          TEMPORARILY_WITHDRAWN: [],
          IN_PROGRESS: [],
          COMPLETED: [
            {
              prisonId: 'WDI',
              prisonName: 'WAKEFIELD (HMP)',
              courseName: 'GCSE Maths',
              courseCode: '246674',
              courseStartDate: moment('2016-05-18').toDate(),
              courseStatus: 'COMPLETED',
              courseCompletionDate: moment('2016-07-15').toDate(),
              grade: null,
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
    expect($('#completed-in-prison-qualifications-table tbody tr').length).toBe(1)
    expect($('#completed-in-prison-qualifications-table tbody tr td:nth-child(3)').text()).toContain('N/A')
  })

  it('should render message if prisoner has no In Prison Qualifications', () => {
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
          COMPLETED: [],
        },
        coursesCompletedInLast12Months: [],
      },
    }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    expect($('#completed-in-prison-qualifications-table tbody tr').length).toBe(1)
    expect($('#completed-in-prison-qualifications-table tbody tr td').length).toBe(1)
    expect($('#completed-in-prison-qualifications-table tbody tr td').text()).toContain(
      'No qualifications or achievements recorded in Curious.',
    )
  })
})
