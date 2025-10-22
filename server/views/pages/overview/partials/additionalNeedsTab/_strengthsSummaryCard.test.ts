import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../../utils/result/result'
import formatStrengthCategoryScreenValueFilter from '../../../../../filters/formatStrengthCategoryFilter'
import StrengthCategory from '../../../../../enums/strengthCategory'

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
  .addFilter('assetMap', () => '')
  .addFilter('formatStrengthCategoryScreenValue', formatStrengthCategoryScreenValueFilter)

const prisonerSummary = aValidPrisonerSummary()
const template = '_strengthsSummaryCard.njk'
const templateParams = {
  prisonerSummary,
  strengthCategories: Result.fulfilled([StrengthCategory.LITERACY_SKILLS, StrengthCategory.NUMERACY_SKILLS]),
}

describe('Additional Needs tab - Strengths Summary Card', () => {
  it('should render the summary card given the prisoner has Strengths', () => {
    // Given
    const params = {
      ...templateParams,
      strengthCategories: Result.fulfilled([
        StrengthCategory.ATTENTION_ORGANISING_TIME,
        StrengthCategory.LITERACY_SKILLS,
        StrengthCategory.MEMORY,
        StrengthCategory.NUMERACY_SKILLS,
        StrengthCategory.SENSORY,
      ]),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const strengthListItems = $('.govuk-summary-card__content li')
    expect(strengthListItems.length).toEqual(5) // Expect 5 list items, one for each Strength
    expect(strengthListItems.eq(0).text().trim()).toEqual('Attention, organising and time management')
    expect(strengthListItems.eq(1).text().trim()).toEqual('Literacy skills')
    expect(strengthListItems.eq(2).text().trim()).toEqual('Memory')
    expect(strengthListItems.eq(3).text().trim()).toEqual('Numeracy skills')
    expect(strengthListItems.eq(4).text().trim()).toEqual('Sensory')

    expect($('[data-qa=no-strengths-recorded-message]').length).toEqual(0)
    expect($('[data-qa=strengths-unavailable-message]').length).toEqual(0)
  })

  it('should render the summary card given the prisoner has no Strengths', () => {
    // Given
    const params = {
      ...templateParams,
      strengthCategories: Result.fulfilled([]),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-strengths-recorded-message]').length).toEqual(1)
    expect($('[data-qa=san-strengths-unavailable-message]').length).toEqual(0)
  })

  it('should render the summary card given the Strengths service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      strengthCategories: Result.rejected(new Error('Failed to get strengths')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=san-strengths-unavailable-message]').length).toEqual(1)
  })
})
