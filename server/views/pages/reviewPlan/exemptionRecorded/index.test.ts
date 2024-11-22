import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('ExemptionRecordedPage', () => {
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

  it('should render the correct content for "Exemption Recorded" page when the exemption reason is technical issue', () => {
    // Given
    const model = {
      prisonerSummary,
      exemptionDueToTechnicalIssue: true,
    }
    const content = njkEnv.render('index.njk', model)

    // When
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="exemption-recorded-panel"]').text().trim()).toBe('Exemption recorded')
    expect($('[data-qa="warning-text"]').text().replace(/\s+/g, ' ').trim()).toBe(
      '! Warning You must remove this exemption when the reason no longer applies.',
    )
    expect($('[data-qa="page-heading"]').text().trim()).toBe('What happens next')
    expect($('[data-qa="review-due"]').length).toEqual(0)
    expect($('[data-qa="session-on-hold"]').text().trim()).toBe(
      'Jimmy Lightfingers is now exempt from reviews and the session is on hold.',
    )
    expect($('[data-qa="submit-button"]').text().trim()).toBe('Continue')
  })

  it('should render the correct content for "Exemption Recorded" page when the exemption reason is not technical issue', () => {
    // Given
    const model = {
      prisonerSummary,
      exemptionDueToTechnicalIssue: false,
    }
    const content = njkEnv.render('index.njk', model)

    // When
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="exemption-recorded-panel"]').text().trim()).toBe('Exemption recorded')
    expect($('[data-qa="warning-text"]').length).toEqual(0)
    expect($('[data-qa="page-heading"]').text().trim()).toBe('What happens next')
    // TODO update test with review due date
    expect($('[data-qa="review-due"]').text().trim()).toBe(
      'You must now review this learning and work progress plan with Jimmy Lightfingers by [review due date].',
    )
    expect($('[data-qa="session-on-hold"]').length).toEqual(0)
    expect($('[data-qa="submit-button"]').text().trim()).toBe('Continue')
  })
})
