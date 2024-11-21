import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatExemptionReasonValueFilter from '../../../../filters/formatExemptionReasonValueFilter'

describe('ConfirmExemptionPage', () => {
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
    .addFilter('formatExemptionReasonValue', formatExemptionReasonValueFilter)
  const prisonerSummary = aValidPrisonerSummary()

  it('should render the correct content', () => {
    // Given
    const model = {
      prisonerSummary,
      exemptionReason: formatExemptionReasonValueFilter('EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY'),
      exemptionReasonDetails: 'In treatment',
    }
    // When
    const content = njkEnv.render('index.njk', model)
    const $ = cheerio.load(content)
    // Then
    expect($('[data-qa="page-heading"]').text().trim()).toBe(
      "Are you sure you want to put Jimmy Lightfingers's review on hold?",
    )
    expect($('[data-qa="exemption-reason-heading"]').text().trim()).toBe('Exemption reason')
    expect($('[data-qa="exemption-reason"]').text().trim()).toBe(
      'Has a drug or alcohol dependency and is in assessment or treatment',
    )
    expect($('[data-qa="exemption-reason-details-heading"]').text().trim()).toBe('More details:')
    expect($('[data-qa="exemption-reason-details"]').text().trim()).toBe('In treatment')
  })
})
