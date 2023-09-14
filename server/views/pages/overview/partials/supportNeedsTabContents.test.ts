import * as fs from 'fs'
import cheerio from 'cheerio'
import nunjucks, { Template } from 'nunjucks'
import { registerNunjucks } from '../../../../utils/nunjucksSetup'
import aValidPrisonerSupportNeeds from '../../../../testsupport/supportNeedsTestDataBuilder'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('Support Needs tab view', () => {
  const template = fs.readFileSync('server/views/pages/overview/partials/supportNeedsTabContents.njk')
  const prisonerSummary = aValidPrisonerSummary()

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
    const healthAndSupportNeedsCard = $('#health-and-support-needs-summary-card')
    // expect there to be only 1 gov-uk-summmary-list representing the data from the 1 prison in aValidPrisonerSupportNeeds()
    expect(healthAndSupportNeedsCard.find('.govuk-summary-list').length).toEqual(1)
    expect(healthAndSupportNeedsCard.find('h3').text().trim()).toEqual('MOORLAND (HMP & YOI)')
    expect(
      healthAndSupportNeedsCard //
        .find(`.govuk-summary-list__key:contains('Rapid assessment')`)
        .next()
        .text()
        .trim(),
    ).toEqual('18 February 2022')
    expect(
      healthAndSupportNeedsCard //
        .find(`.govuk-summary-list__key:contains('In-depth assessment')`)
        .next()
        .text()
        .trim(),
    ).toEqual('Not recorded in Curious')
    expect(
      healthAndSupportNeedsCard //
        .find(`.govuk-summary-list__key:contains('Primary LDD and health needs')`)
        .next()
        .text()
        .trim(),
    ).toEqual('Visual impairment')
    expect(
      healthAndSupportNeedsCard //
        .find(`.govuk-summary-list__key:contains('Additional LDD and health needs')`)
        .next()
        .find('li')
        .toArray()
        .map(el => $(el).text()),
    ).toEqual(['Hearing impairment', 'Mental health difficulty', 'Social and emotional difficulties'])

    const summaryListRow = '.govuk-summary-list__row'
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
