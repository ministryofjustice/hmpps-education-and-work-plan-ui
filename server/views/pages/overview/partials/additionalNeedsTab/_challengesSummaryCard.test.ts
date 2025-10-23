import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../../utils/result/result'
import ChallengeCategory from '../../../../../enums/challengeCategory'
import formatChallengeCategoryScreenValueFilter from '../../../../../filters/formatChallengeCategoryFilter'

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
  .addFilter('formatChallengeCategoryScreenValue', formatChallengeCategoryScreenValueFilter)

const prisonerSummary = aValidPrisonerSummary()
const template = '_challengesSummaryCard.njk'
const templateParams = {
  prisonerSummary,
  challengeCategories: Result.fulfilled([ChallengeCategory.LITERACY_SKILLS, ChallengeCategory.NUMERACY_SKILLS]),
}

describe('Additional Needs tab - Challenges Summary Card', () => {
  it('should render the summary card given the prisoner has Challenges', () => {
    // Given
    const params = {
      ...templateParams,
      challengeCategories: Result.fulfilled([
        ChallengeCategory.ATTENTION_ORGANISING_TIME,
        ChallengeCategory.LITERACY_SKILLS,
        ChallengeCategory.MEMORY,
        ChallengeCategory.NUMERACY_SKILLS,
        ChallengeCategory.SENSORY,
      ]),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const challengeListItems = $('.govuk-summary-card__content li')
    expect(challengeListItems.length).toEqual(5) // Expect 5 list items, one for each Challenge
    expect(challengeListItems.eq(0).text().trim()).toEqual('Attention, organising and time management')
    expect(challengeListItems.eq(1).text().trim()).toEqual('Literacy skills')
    expect(challengeListItems.eq(2).text().trim()).toEqual('Memory')
    expect(challengeListItems.eq(3).text().trim()).toEqual('Numeracy skills')
    expect(challengeListItems.eq(4).text().trim()).toEqual('Sensory')

    expect($('[data-qa=no-challenges-recorded-message]').length).toEqual(0)
    expect($('[data-qa=san-challenges-unavailable-message]').length).toEqual(0)
  })

  it('should render the summary card given the prisoner has no Challenges', () => {
    // Given
    const params = {
      ...templateParams,
      challengeCategories: Result.fulfilled([]),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-challenges-recorded-message]').length).toEqual(1)
    expect($('[data-qa=san-challenges-unavailable-message]').length).toEqual(0)
  })

  it('should render the summary card given the Challenges service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      challengeCategories: Result.rejected(new Error('Failed to get challenges')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=san-challenges-unavailable-message]').length).toEqual(1)
  })
})
