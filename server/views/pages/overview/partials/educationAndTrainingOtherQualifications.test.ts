import * as fs from 'fs'
import cheerio from 'cheerio'
import nunjucks, { Template } from 'nunjucks'
import { registerNunjucks } from '../../../../utils/nunjucksSetup'

describe('Education and Training tab view - Other Qualifications and history', () => {
  const template = fs.readFileSync('server/views/pages/overview/partials/educationAndTrainingOtherQualifications.njk')
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

  it('should render Other Qualifications and history summary list', () => {
    // Given
    viewContext = {
      prisonerSummary,
      tab: 'education-and-training',
      otherQualifications: {
        problemRetrievingData: false,
        highestEducationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS',
        additionalTraining: ['FIRST_AID_CERTIFICATE', 'HEALTH_AND_SAFETY'],
      },
    }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    expect($('#other-qualifications-list .govuk-summary-list__row').length).toBe(2)
    expect(
      $('#other-qualifications-list .govuk-summary-list__row:nth-of-type(1) .govuk-summary-list__value').text(),
    ).toContain('SECONDARY_SCHOOL_TOOK_EXAMS')
    expect(
      $('#other-qualifications-list .govuk-summary-list__row:nth-of-type(2) .govuk-summary-list__value').text(),
    ).toContain('FIRST_AID_CERTIFICATE')
    expect(
      $('#other-qualifications-list .govuk-summary-list__row:nth-of-type(2) .govuk-summary-list__value').text(),
    ).toContain('HEALTH_AND_SAFETY')
  })

  it('should render content saying curious is unavailable given problem retrieving data is true', () => {
    // Given
    viewContext = {
      prisonerSummary,
      tab: 'education-and-training',
      otherQualifications: {
        problemRetrievingData: true,
      },
    }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    expect($('h2').text()).toContain('Sorry, the CIAG Induction service is currently unavailable.')
  })
})
