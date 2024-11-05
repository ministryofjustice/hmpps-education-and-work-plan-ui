import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('ReviewCompletePage', () => {
  const njkEnv = nunjucks.configure([
    'node_modules/govuk-frontend/govuk/',
    'node_modules/govuk-frontend/govuk/components/',
    'node_modules/govuk-frontend/govuk/template/',
    'node_modules/govuk-frontend/dist/',
    'node_modules/@ministryofjustice/frontend/',
    'server/views/',
    __dirname,
  ])

  const prisonerSummary = aValidPrisonerSummary()

  // TODO update tests with correct dates and corresponding review due text
  it('should render the correct content for "Review complete" page', () => {
    // Given
    const model = { prisonerSummary }
    const content = njkEnv.render('index.njk', model)

    // When
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="review-complete-panel"]').text().trim()).toBe('Review marked as complete')
    expect($('[data-qa="page-heading"]').text().trim()).toBe('What happens next')
    expect($('[data-qa="no-reviews-due"]').text().trim()).toBe(
      "No more reviews due as Jimmy Lightfingers's release date is [release date].",
    )
    expect($('[data-qa="next-review-due"]').text().trim()).toBe(
      "Jimmy Lightfingers's next review is due between [earliest due date] and [latest due date].",
    )
    expect($('[data-qa="show-alerts"]').text().trim()).toBe(
      "We'll show alerts in the service when the review is due so you can book it in.",
    )
    expect($('[data-qa="submit-button"]').text().trim()).toBe('Go to learning and work progress plan')
    expect($('[data-qa="submit-button"]').attr('href')).toBe(`/plan/${prisonerSummary.prisonNumber}/view/overview`)
  })
})
