import * as cheerio from 'cheerio'
import nunjucks from 'nunjucks'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import { formatSupportStrategyTypeScreenValueFilter } from '../../../../../filters/formatSupportStrategyTypeFilter'
import aValidSupportStrategyResponseDto from '../../../../../testsupport/supportStrategyResponseDtoTestDataBuilder'
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

njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatSupportStrategyTypeScreenValue', formatSupportStrategyTypeScreenValueFilter)

const prisonerSummary = aValidPrisonerSummary()
const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }
const template = '_supportStrategiesSummaryCard.njk'
const templateParams = {
  prisonerSummary,
  prisonNamesById,
  groupedSupportStrategies: Result.fulfilled({ MEMORY: [aValidSupportStrategyResponseDto()] }),
}

describe('Additional Needs tab - Support Strategies Summary Card', () => {
  it('should render the Support Strategies Summary Card given there are Support Strategies', () => {
    // Given
    const params = {
      ...templateParams,
      groupedSupportStrategies: Result.fulfilled({
        MEMORY: [aValidSupportStrategyResponseDto(), aValidSupportStrategyResponseDto()],
        LITERACY_SKILLS_DEFAULT: [aValidSupportStrategyResponseDto()],
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=support-strategies-summary-list]').length).toEqual(1)
    expect($('[data-qa=support-strategy-summary-list-row]').length).toEqual(2)
    expect($('[data-qa=support-strategy-summary-list-row] h3').eq(0).text().trim()).toEqual('Memory')
    expect(
      $('[data-qa=support-strategy-summary-list-row]').eq(0).find('[data-qa=support-strategy-details]').length,
    ).toEqual(2)
    expect($('[data-qa=support-strategy-summary-list-row] h3').eq(1).text().trim()).toEqual('Literacy skills')
    expect(
      $('[data-qa=support-strategy-summary-list-row]').eq(1).find('[data-qa=support-strategy-details]').length,
    ).toEqual(1)
    expect($('[data-qa=no-support-strategies-recorded-message]').length).toEqual(0)
  })

  it('should render the Support Strategies Summary Card given there are no Support Strategies', () => {
    // Given
    const params = {
      ...templateParams,
      groupedSupportStrategies: Result.fulfilled({}),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=support-strategies-summary-list]').length).toEqual(0)
    expect($('[data-qa=no-support-strategies-recorded-message]').length).toEqual(1)
  })

  it('should render the Support Strategies Summary Card given the Curious service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      groupedSupportStrategies: Result.rejected(new Error('Failed to get ALN and LDD assessments')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=support-strategies-unavailable-message]').length).toEqual(1)
  })
})
