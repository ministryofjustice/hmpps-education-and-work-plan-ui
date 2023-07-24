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
    expect($('#health-and-support-needs-summary-card')).not.toBeUndefined()
    expect($('#neurodiversity-summary-card')).not.toBeUndefined()
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
