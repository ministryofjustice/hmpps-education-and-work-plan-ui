import fs from 'fs'
import cheerio from 'cheerio'
import nunjucks, { Template } from 'nunjucks'
import { registerNunjucks } from '../../../../utils/nunjucksSetup'
import aValidPrisonerSupportNeeds from '../../../../testsupport/supportNeedsTestDataBuilder'

describe('Support Needs tab view', () => {
  const template = fs.readFileSync('server/views/pages/overview/partials/supportNeedsTabContents.njk')
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

  it('should render content', () => {
    // Given
    const supportNeeds = aValidPrisonerSupportNeeds()
    viewContext = { prisonerSummary, tab: 'support-needs', supportNeeds }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    const summaryListRow = '.govuk-summary-list__row'
    const healthAndSupportNeedsCard = '#health-and-support-needs-summary-card'
    expect($(`${healthAndSupportNeedsCard} ${summaryListRow}:nth-of-type(1) .govuk-list`).text()).toContain('Bilingual')

    // check primary LDD is displayed first, with secondary ones in alphabetical order
    const lddHealthNeeds = `${healthAndSupportNeedsCard} ${summaryListRow}:nth-of-type(2) .govuk-list`
    expect($(`${lddHealthNeeds} li:nth-of-type(1)`).text()).toContain('Visual impairment')
    expect($(`${lddHealthNeeds} li:nth-of-type(2)`).text()).toContain('Hearing impairment')
    expect($(`${lddHealthNeeds} li:nth-of-type(3)`).text()).toContain('Mental health difficulty')
    expect($(`${lddHealthNeeds} li:nth-of-type(4)`).text()).toContain('Social and emotional difficulties')

    const neurodiversityCard = '#neurodiversity-summary-card'
    const supportNeeded = `${neurodiversityCard} ${summaryListRow}:nth-of-type(1) .govuk-list:nth-of-type(1) li:nth-of-type(1)`
    const neurodiversity = `${neurodiversityCard} ${summaryListRow}:nth-of-type(2) .govuk-list:nth-of-type(1) li:nth-of-type(1)`
    expect($(`${supportNeeded}`).text()).toContain('Writing support')
    expect($(`${neurodiversity}`).text()).toContain('Dyslexia')
  })

  it('should render content saying curious is unavailable given problem retrieving data is true', () => {
    // Given
    viewContext = {
      prisonerSummary,
      tab: 'support-needs',
      supportNeeds: {
        problemRetrievingData: true,
      },
    }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    expect($('h2').text()).toEqual('Sorry, the Curious service is currently unavailable.')
  })
})
