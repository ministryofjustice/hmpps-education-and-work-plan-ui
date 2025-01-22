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
        isPostInduction: true, // This determines whether the Induction or Review actions are rendered. We dont expect both. post-induction will get Review actions; not post-induction (pre-induction) will get Induction actions
      },
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'NO_SCHEDULED_INDUCTION',
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
      },
      hasEditAuthority: true,
      reviewJourneyEnabledForPrison: true,
    }

    // When
    const content = nunjucks.render('actionCards.test.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(0) // We don't expect BOTH induction & Review actions; logic contains check on whether it is post-induction or not
    expect($('[data-qa=review-actions]').length).toEqual(1)
    expect($('[data-qa=goal-actions]').length).toEqual(1)
  })
})
