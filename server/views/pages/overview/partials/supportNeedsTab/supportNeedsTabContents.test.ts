import * as fs from 'fs'
import cheerio, { Cheerio, CheerioAPI } from 'cheerio'
import nunjucks, { Template } from 'nunjucks'
import { registerNunjucks } from '../../../../../utils/nunjucksSetup'
import aValidPrisonerSupportNeeds from '../../../../../testsupport/supportNeedsTestDataBuilder'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('Support Needs tab view', () => {
  const template = fs.readFileSync('server/views/pages/overview/partials/supportNeedsTab/supportNeedsTabContents.njk')
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
    setupCheerioExtensionFunctions($)

    // Then
    const healthAndSupportNeedsCard = $('#health-and-support-needs-summary-card')
    // expect there to be only 1 gov-uk-summmary-list representing the data from the 1 prison in aValidPrisonerSupportNeeds()
    expect(healthAndSupportNeedsCard.find('.govuk-summary-list').length).toEqual(1)
    expect(healthAndSupportNeedsCard.heading()).toContain(
      `Jimmy Lightfingers's learning difficulties, disabilities and health needs recorded whilst at`,
    )
    expect(healthAndSupportNeedsCard.heading()).toContain('MOORLAND (HMP & YOI)')
    expect(healthAndSupportNeedsCard.rapidAssessmentDate()).toEqual('18 February 2022')
    expect(healthAndSupportNeedsCard.inDepthAssessmentDate()).toEqual('Not recorded in Curious')
    expect(healthAndSupportNeedsCard.primaryLddAndHealthNeeds()).toEqual('Visual impairment')
    expect(healthAndSupportNeedsCard.additionalLddAndHealthNeeds()).toEqual([
      'Hearing impairment',
      'Mental health difficulty',
      'Social and emotional difficulties',
    ])

    const neurodiversityCard = $('#neurodiversity-summary-card')
    // expect there to be only 1 gov-uk-summmary-list representing the data from the 1 prison in aValidPrisonerSupportNeeds()
    expect(neurodiversityCard.find('.govuk-summary-list').length).toEqual(1)
    expect(neurodiversityCard.heading()).toContain(
      `Jimmy Lightfingers's neurodiversity support needs recorded whilst at`,
    )
    expect(neurodiversityCard.heading()).toContain('MOORLAND (HMP & YOI)')
    expect(neurodiversityCard.neurodiversitySupportNeeds()).toContain('Writing support')
    expect(neurodiversityCard.neurodiversitySupportNeeds()).toContain('Recorded on 18 February 2022')
    expect(neurodiversityCard.assessedNeurodiversityDiagnosis()).toContain('No Identified Neurodiversity Need')
    expect(neurodiversityCard.assessedNeurodiversityDiagnosis()).toContain('Recorded on 18 May 2022')
    expect(neurodiversityCard.selfDeclaredNeurodiversityDiagnosis()).toContain('Dyslexia')
    expect(neurodiversityCard.selfDeclaredNeurodiversityDiagnosis()).toContain('Recorded on 18 February 2022')
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
    expect($('h2').text()).toEqual('We cannot show these details from Curious right now')
  })
})

declare module 'cheerio' {
  interface Cheerio<T> {
    heading(this: Cheerio<T>): Cheerio<T>
    rapidAssessmentDate(this: Cheerio<T>): Cheerio<T>
    inDepthAssessmentDate(this: Cheerio<T>): Cheerio<T>
    primaryLddAndHealthNeeds(this: Cheerio<T>): Cheerio<T>
    additionalLddAndHealthNeeds(this: Cheerio<T>): Cheerio<T>
    selfDeclaredNeurodiversityDiagnosis(this: Cheerio<T>): Cheerio<T>
    assessedNeurodiversityDiagnosis(this: Cheerio<T>): Cheerio<T>
    neurodiversitySupportNeeds(this: Cheerio<T>): Cheerio<T>
  }
}

const setupCheerioExtensionFunctions = ($: CheerioAPI) => {
  // eslint-disable-next-line no-param-reassign
  $.prototype.heading = function heading(): Cheerio<never> {
    return this.find('h3').text()
  }
  // eslint-disable-next-line no-param-reassign
  $.prototype.rapidAssessmentDate = function rapidAssessmentDate(): Cheerio<never> {
    return this.find(`.govuk-summary-list__key:contains('Rapid assessment')`).next().text().trim()
  }
  // eslint-disable-next-line no-param-reassign
  $.prototype.inDepthAssessmentDate = function inDepthAssessmentDate(): Cheerio<never> {
    return this.find(`.govuk-summary-list__key:contains('In-depth assessment')`).next().text().trim()
  }
  // eslint-disable-next-line no-param-reassign
  $.prototype.primaryLddAndHealthNeeds = function primaryLddAndHealthNeeds(): Cheerio<never> {
    return this.find(`.govuk-summary-list__key:contains('Primary LDD and health needs')`).next().text().trim()
  }
  // eslint-disable-next-line no-param-reassign
  $.prototype.additionalLddAndHealthNeeds = function additionalLddAndHealthNeeds(): Cheerio<never> {
    return this.find(`.govuk-summary-list__key:contains('Additional LDD and health needs')`)
      .next()
      .find('li')
      .toArray()
      .map((el: never) => $(el).text())
  }
  // eslint-disable-next-line no-param-reassign
  $.prototype.selfDeclaredNeurodiversityDiagnosis = function selfDeclaredNeurodiversityDiagnosis(): Cheerio<never> {
    return this.find(`.govuk-summary-list__key:contains('Self-declared')`).next().text()
  }
  // eslint-disable-next-line no-param-reassign
  $.prototype.assessedNeurodiversityDiagnosis = function assessedNeurodiversityDiagnosis(): Cheerio<never> {
    return this.find(`.govuk-summary-list__key:contains('From neurodiversity assessment')`).next().text()
  }
  // eslint-disable-next-line no-param-reassign
  $.prototype.neurodiversitySupportNeeds = function neurodiversitySupportNeeds(): Cheerio<never> {
    return this.find(`.govuk-summary-list__key:contains('Support needed')`).next().text()
  }
}
