import * as fs from 'fs'
import cheerio from 'cheerio'
import moment from 'moment'
import nunjucks, { Template } from 'nunjucks'
import { registerNunjucks } from '../../../../utils/nunjucksSetup'

describe('Education and Training tab view - In Prison Qualifications', () => {
  const template = fs.readFileSync(
    'server/views/pages/overview/partials/educationAndTrainingInPrisonQualifications.njk',
  )
  const prisonerSummary = {
    prisonNumber: 'A1234BC',
    releaseDate: '2025-12-31',
    location: 'C-01-04',
    firstName: 'Jimmy',
    lastName: 'Lightfingers',
  }

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
      completedInPrisonEducation: {
        problemRetrievingData: false,
        educationRecords: [
          {
            prisonId: 'WDI',
            prisonName: 'WAKEFIELD (HMP)',
            courseName: 'GCSE Maths',
            courseCode: '246674',
            courseStartDate: moment('2016-05-18').toDate(),
            courseCompleted: true,
            courseCompletionDate: moment('2016-07-15').toDate(),
            grade: 'A*',
            source: 'CURIOUS',
          },
        ],
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
      completedInPrisonEducation: {
        problemRetrievingData: true,
      },
    }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    expect($('h2').text()).toContain('Sorry, the Curious service is currently unavailable.')
  })

  it('should render grade if present for an In Prison Qualification', () => {
    viewContext = {
      prisonerSummary,
      tab: 'education-and-training',
      completedInPrisonEducation: {
        problemRetrievingData: false,
        educationRecords: [
          {
            prisonId: 'WDI',
            prisonName: 'WAKEFIELD (HMP)',
            courseName: 'GCSE Maths',
            courseCode: '246674',
            courseStartDate: moment('2016-05-18').toDate(),
            courseCompleted: true,
            courseCompletionDate: moment('2016-07-15').toDate(),
            grade: 'A*',
            source: 'CURIOUS',
          },
        ],
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
      completedInPrisonEducation: {
        problemRetrievingData: false,
        educationRecords: [
          {
            prisonId: 'WDI',
            prisonName: 'WAKEFIELD (HMP)',
            courseName: 'GCSE Maths',
            courseCode: '246674',
            courseStartDate: moment('2016-05-18').toDate(),
            courseCompleted: true,
            courseCompletionDate: moment('2016-07-15').toDate(),
            grade: null,
            source: 'CURIOUS',
          },
        ],
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
      completedInPrisonEducation: {
        problemRetrievingData: false,
        educationRecords: [],
      },
    }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    expect($('#completed-in-prison-qualifications-table tbody tr').length).toBe(1)
    expect($('#completed-in-prison-qualifications-table tbody tr td').length).toBe(1)
    expect($('#completed-in-prison-qualifications-table tbody tr td').text()).toContain(
      'Jimmy Lightfingers has no recorded in-prison qualifications and achievements.',
    )
  })
})
