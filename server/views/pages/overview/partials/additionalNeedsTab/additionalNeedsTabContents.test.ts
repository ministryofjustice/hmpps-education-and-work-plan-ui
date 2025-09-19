import * as cheerio from 'cheerio'
import nunjucks from 'nunjucks'
import { startOfDay } from 'date-fns'
import type { PrisonerSupportNeeds } from 'viewModels'
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
const template = 'additionalNeedsTabContents.njk'
const templateParams = {
  tab: 'additional-needs',
  prisonerSummary,
  prisonNamesById: Result.fulfilled(prisonNamesById),
  supportNeeds: Result.fulfilled(aValidPrisonerSupportNeeds()),
}

describe('Additional Needs tab view', () => {
  it('should render the Additional Needs page given a prison has LDD assessment data recorded', () => {
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

    // LDD Assessment data from Moorland
    const moorlandAssessment = $('[data-qa=ldd-assessment-recorded-at-MDI]')
    expect(moorlandAssessment.length).toEqual(1)
    expect(moorlandAssessment.find('[data-qa=prison-name]').text().trim()).toContain('Moorland (HMP & YOI)')
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
  })

  it('should should render the Additional Needs page given there are no LDD assessments recorded', () => {
    // Given
    const supportNeeds: PrisonerSupportNeeds = {
      lddAssessments: [],
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
    expect($('[data-qa=no-assessments-message]').length).toEqual(1)
  })

  it('should render the Additional Needs page given the Curious service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      supportNeeds: Result.rejected(new Error('Failed to get Prisoner Additional Needs')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=curious-assessments-unavailable-message]').length).toEqual(1)
  })
})
