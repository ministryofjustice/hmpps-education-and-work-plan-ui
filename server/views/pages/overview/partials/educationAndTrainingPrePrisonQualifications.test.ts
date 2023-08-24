import * as fs from 'fs'
import cheerio from 'cheerio'
import nunjucks, { Template } from 'nunjucks'
import { registerNunjucks } from '../../../../utils/nunjucksSetup'

describe('Education and Training tab view - Pre Prison Qualifications', () => {
  const template = fs.readFileSync(
    'server/views/pages/overview/partials/educationAndTrainingPrePrisonQualifications.njk',
  )
  const prisonerSummary = {
    prisonNumber: 'A1234BC',
    releaseDate: '2025-12-31',
    location: 'C-01-04',
    firstName: 'Wayne',
    lastName: 'Kerr',
  }

  let compiledTemplate: Template
  let viewContext: Record<string, unknown>

  const njkEnv = registerNunjucks()

  beforeEach(() => {
    compiledTemplate = nunjucks.compile(template.toString(), njkEnv)
  })

  it('should render Pre Prison Qualifications table', () => {
    // Given
    viewContext = {
      prisonerSummary,
      tab: 'education-and-training',
      prePrisonQualifications: {
        problemRetrievingData: false,
        highestEducationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS',
        additionalTraining: ['FIRST_AID_CERTIFICATE', 'HEALTH_AND_SAFETY'],
      },
    }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    expect($('#pre-prison-qualifications-table tbody tr').length).toBe(2)
    expect($('#pre-prison-qualifications-table tbody tr td').length).toBe(4)
    expect($('#pre-prison-qualifications-table tbody tr td:nth-child(2)').text()).toContain(
      'SECONDARY_SCHOOL_TOOK_EXAMS',
    )
    expect($('#pre-prison-qualifications-table tbody tr td:nth-child(2)').text()).toContain('FIRST_AID_CERTIFICATE')
    expect($('#pre-prison-qualifications-table tbody tr td:nth-child(2)').text()).toContain('HEALTH_AND_SAFETY')
  })

  it('should render content saying curious is unavailable given problem retrieving data is true', () => {
    // Given
    viewContext = {
      prisonerSummary,
      tab: 'education-and-training',
      prePrisonQualifications: {
        problemRetrievingData: true,
      },
    }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    expect($('h2').text()).toContain('Sorry, the CIAG Induction service is currently unavailable.')
  })
})
