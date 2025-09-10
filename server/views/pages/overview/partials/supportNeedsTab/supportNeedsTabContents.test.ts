import * as cheerio from 'cheerio'
import nunjucks from 'nunjucks'
import { startOfDay } from 'date-fns'
import aValidPrisonerSupportNeeds from '../../../../../testsupport/supportNeedsTestDataBuilder'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import fallbackMessageFilter from '../../../../../filters/fallbackMessageFilter'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import { Result } from '../../../../../utils/result/result'

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

const prisonerSummary = aValidPrisonerSummary()
const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }
const template = 'supportNeedsTabContents.njk'
const templateParams = {
  tab: 'support-needs',
  prisonerSummary,
  prisonNamesById: Result.fulfilled(prisonNamesById),
  supportNeeds: Result.fulfilled(aValidPrisonerSupportNeeds()),
}

describe('Support Needs tab view', () => {
  it('should render the Support Needs page given a prison has LDD assessment data recorded', () => {
    // Given
    const supportNeeds = {
      lddAssessments: [
        {
          prisonId: 'MDI',
          rapidAssessmentDate: startOfDay('2022-02-18'),
          inDepthAssessmentDate: null as Date,
          primaryLddAndHealthNeeds: 'Visual impairment',
          additionalLddAndHealthNeeds: [
            'Hearing impairment',
            'Mental health difficulty',
            'Social and emotional difficulties',
          ],
          hasSupportNeeds: true,
        },
        {
          prisonId: 'BXI',
          rapidAssessmentDate: null as Date,
          inDepthAssessmentDate: null as Date,
          primaryLddAndHealthNeeds: null as string,
          additionalLddAndHealthNeeds: [],
          hasSupportNeeds: false,
        },
      ],
    }
    const params = {
      ...templateParams,
      supportNeeds: Result.fulfilled(supportNeeds),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=health-and-support-needs-summary-card]').length).toEqual(1)
    expect($('[data-qa=support-needs-list]')).toHaveLength(1)

    // LDD Assessment data from Moorland where the assessment was recorded with support needs
    const moorlandAssessment = $('[data-qa=ldd-assessment-recorded-at-MDI]')
    expect(moorlandAssessment.length).toEqual(1)
    expect(moorlandAssessment.find('[data-qa=prison-name]').text().trim()).toContain('Moorland (HMP & YOI)')
    expect(moorlandAssessment.find('[data-qa=no-screener-for-prison-message]').length).toEqual(0)
    expect(moorlandAssessment.find('[data-qa=rapid-assessment-date]').text().trim()).toEqual('18 February 2022')
    expect(moorlandAssessment.find('[data-qa=in-depth-assessment-date]').text().trim()).toEqual(
      'Not recorded in Curious',
    )
    expect(moorlandAssessment.find('[data-qa=primary-ldd-needs]').text().trim()).toEqual('Visual impairment')
    const moorlandAssessmentAdditionalNeeds = moorlandAssessment
      .find('[data-qa=additional-ldd-needs] li')
      .map((_idx, el) => $(el).text().trim())
      .get()
    expect(moorlandAssessmentAdditionalNeeds).toEqual([
      'Hearing impairment',
      'Mental health difficulty',
      'Social and emotional difficulties',
    ])

    // LDD Assessment data from Brixton where there is data from Curious but with no apparent data recorded
    const brixtonAssessment = $('[data-qa=ldd-assessment-recorded-at-BXI]')
    expect(brixtonAssessment.length).toEqual(1)
    expect(brixtonAssessment.find('[data-qa=prison-name]').text().trim()).toContain('Brixton (HMP)')
    expect(brixtonAssessment.find('[data-qa=no-screener-for-prison-message]').length).toEqual(1)
  })

  it('should should render the Support Needs page given there is more than one prison and none of them have LDD assessment data recorded', () => {
    // Given
    const supportNeeds = {
      lddAssessments: [
        {
          prisonId: 'MDI',
          rapidAssessmentDate: null as Date,
          inDepthAssessmentDate: null as Date,
          primaryLddAndHealthNeeds: null as string,
          additionalLddAndHealthNeeds: [] as Array<string>,
          hasSupportNeeds: false,
        },
        {
          prisonId: 'BXI',
          rapidAssessmentDate: null as Date,
          inDepthAssessmentDate: null as Date,
          primaryLddAndHealthNeeds: null as string,
          additionalLddAndHealthNeeds: [] as Array<string>,
          hasSupportNeeds: false,
        },
      ],
    }
    const params = {
      ...templateParams,
      supportNeeds: Result.fulfilled(supportNeeds),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=support-needs-list]').length).toEqual(0)
    expect($('[data-qa=no-data-message]').length).toEqual(1)
  })

  it('should render the Support Needs page given the Curious service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      supportNeeds: Result.rejected(new Error('Failed to get Prisoner Support Needs')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=health-and-support-needs-summary-card]').length).toEqual(0)
    expect($('[data-qa=curious-unavailable-message]').length).toEqual(1)
  })
})
