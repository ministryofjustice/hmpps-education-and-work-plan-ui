import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import findErrorFilter from '../../../../../filters/findErrorFilter'

describe('WhoCompletedReviewPage', () => {
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
    .addFilter('findError', findErrorFilter)

  const prisonerSummary = aValidPrisonerSummary()

  it('should render the correct content', () => {
    // Given
    const model = {
      prisonerSummary,
    }

    // When
    const content = njkEnv.render('index.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="page-heading"]').text().trim()).toBe("Who completed Jimmy Lightfingers's review?")
    expect($('[data-qa="warning-text"]').text().replace(/\s+/g, ' ').trim()).toBe(
      '! Warning Update the progress plan before marking the review as complete',
    )
    expect($('[data-qa="completed-by-other-full-name"]').text().trim()).toBe('Full name')
    expect($('[data-qa="completed-by-other-job-role"]').text().trim()).toBe('Job role')
    const radioLabels = $('input[name="completedBy"] + label')
    expect($(radioLabels[0]).text().trim()).toBe('I did the review myself')
    expect($(radioLabels[1]).text().trim()).toBe('Somebody else did the review')
    expect($('[data-qa="add-review-date"]').text().trim()).toBe('Add the review date')
  })
})
