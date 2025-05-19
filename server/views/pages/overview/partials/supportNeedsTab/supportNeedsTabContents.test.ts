import * as cheerio from 'cheerio'
import nunjucks from 'nunjucks'
import type { HealthAndSupportNeeds } from 'viewModels'
import aValidPrisonerSupportNeeds from '../../../../../testsupport/supportNeedsTestDataBuilder'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import fallbackMessageFilter from '../../../../../filters/fallbackMessageFilter'
import formatDateFilter from '../../../../../filters/formatDateFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv.addFilter('fallbackMessage', fallbackMessageFilter)
njkEnv.addFilter('formatDate', formatDateFilter)

const template = 'supportNeedsTabContents.njk'
const prisonerSummary = aValidPrisonerSummary()

describe('Support Needs tab view', () => {
  it('should render correct content when a prison has support needs data recorded', () => {
    // Given
    const supportNeeds = {
      ...aValidPrisonerSupportNeeds(),
      healthAndSupportNeeds: aValidPrisonerSupportNeeds().healthAndSupportNeeds.map(supportNeed => ({
        ...supportNeed,
        hasSupportNeeds: true,
      })),
    }
    const pageViewModel = {
      tab: 'support-needs',
      prisonerSummary,
      supportNeeds,
      atLeastOnePrisonHasSupportNeeds: true,
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    // expect there to be 2 gov-uk-summmary-list representing the data from the 2 prisons in aValidPrisonerSupportNeeds()
    expect($('[data-qa=support-needs-list]')).toHaveLength(2)
    expect($('[data-qa=prison-name]').first().text()).toContain('Moorland (HMP & YOI)')
    expect($('[data-qa=rapid-assessment-date]').first().text()).toContain('18 February 2022')
    expect($('[data-qa=in-depth-assessment-date]').first().text()).toContain('Not recorded in Curious')
    expect($('[data-qa=primary-ldd-needs]').first().text()).toContain('Visual impairment')
    const additionalNeeds = $('[data-qa=additional-ldd-needs]')
      .first()
      .find('li')
      .map((_, el) => $(el).text().trim())
      .get()
    expect(additionalNeeds).toEqual([
      'Hearing impairment',
      'Mental health difficulty',
      'Social and emotional difficulties',
    ])
  })

  it('should render a message when there is more than one prison and none of them have support needs data recorded', () => {
    // Given
    const supportNeeds = {
      ...aValidPrisonerSupportNeeds(),
      healthAndSupportNeeds: aValidPrisonerSupportNeeds().healthAndSupportNeeds.map(
        supportNeed =>
          ({
            ...supportNeed,
            rapidAssessmentDate: undefined,
            inDepthAssessmentDate: undefined,
            primaryLddAndHealthNeeds: null,
            additionalLddAndHealthNeeds: [],
            hasSupportNeeds: false,
          }) as HealthAndSupportNeeds,
      ),
    }
    const pageViewModel = {
      tab: 'support-needs',
      prisonerSummary,
      supportNeeds,
      atLeastOnePrisonHasSupportNeeds: false,
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    // expect there to be 0 gov-uk-summmary-list, replaced with a message stating no LDD screener data available
    expect($('[data-qa=support-needs-list]')).toHaveLength(0)
    expect($('[data-qa=no-data-message]').text()).toContain(
      'Ifereeca Peigh has no screener and assessment results recorded in Curious.',
    )
  })

  it('should render content saying curious is unavailable given problem retrieving data is true', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      tab: 'support-needs',
      supportNeeds: {
        problemRetrievingData: true,
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=curious-unavailable-message]').text()).toEqual(
      'We cannot show these details from Curious right now',
    )
  })
})
