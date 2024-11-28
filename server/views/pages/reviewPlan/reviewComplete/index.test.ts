import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidReviewPlanDto from '../../../../testsupport/reviewPlanDtoTestDataBuilder'
import formatDate from '../../../../filters/formatDateFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv.addFilter('formatDate', formatDate)

const prisonerSummary = aValidPrisonerSummary()

describe('ReviewCompletePage', () => {
  it('should render the correct content for "Review complete" page given prisoner has had their last review', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      reviewPlanDto: aValidReviewPlanDto({ wasLastReviewBeforeRelease: true }),
    }

    // When
    const content = njkEnv.render('index.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="no-reviews-due"]').text().trim()).toEqual(
      "No more reviews due as Jimmy Lightfingers's release date is 31 December 2025.",
    )
    expect($('[data-qa="next-review-due"]').length).toEqual(0)
  })

  it('should render the correct content for "Review complete" page given prisoner has a new review scheduled', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      reviewPlanDto: aValidReviewPlanDto({
        wasLastReviewBeforeRelease: false,
        nextReviewDateFrom: startOfDay('2025-01-01'),
        nextReviewDateTo: startOfDay('2025-02-28'),
      }),
    }

    // When
    const content = njkEnv.render('index.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="no-reviews-due"]').length).toEqual(0)
    expect($('[data-qa="next-review-due"]').text().trim()).toEqual(
      "Jimmy Lightfingers's next review is due between 1 January 2025 and 28 February 2025.",
    )
  })
})
