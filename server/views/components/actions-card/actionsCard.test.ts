import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { ActionsCardParams } from 'viewComponents'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDateFilter from '../../../filters/formatDateFilter'
import formatReviewExemptionReasonFilter from '../../../filters/formatReviewExemptionReasonFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv.addFilter('formatDate', formatDateFilter)
njkEnv.addFilter('formatReviewExemptionReason', formatReviewExemptionReasonFilter)

describe('Tests for actions card component', () => {
  it('should render the actions card component', () => {
    // Given
    const params: ActionsCardParams = {
      prisonerSummary: aValidPrisonerSummary(),
      induction: {
        problemRetrievingData: false,
        isPostInduction: true,
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
        reviewDueDate: undefined,
        exemptionReason: undefined,
      },
      hasEditAuthority: true,
      reviewJourneyEnabledForPrison: true,
    }

    // When
    const content = nunjucks.render('actionCards.test.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=review-actions]').length).toEqual(1)
    expect($('[data-qa=goal-actions]').length).toEqual(1)
  })
})
