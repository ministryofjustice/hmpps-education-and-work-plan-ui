import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDate from '../../../../../filters/formatDateFilter'
import assetMapFilter from '../../../../../filters/assetMapFilter'

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
  .addFilter('formatDate', formatDate)
  .addFilter('assetMap', assetMapFilter)

describe('ExemptionRecordedPage', () => {
  const prisonerSummary = aValidPrisonerSummary()

  it('should render the correct content for "Exemption Recorded" page when the exemption reason is technical issue', () => {
    // Given
    const model = {
      prisonerSummary,
      nextReviewDate: startOfDay('2024-11-09'),
      exemptionDueToTechnicalIssue: true,
    }
    const content = njkEnv.render('index.njk', model)

    // When
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="warning-text"]').length).toEqual(0)
    expect($('[data-qa="review-due"]').length).toEqual(1)
    expect($('[data-qa="review-due"]').text().trim()).toBe(
      'You must now review this learning and work plan with Ifereeca Peigh by 9 November 2024.',
    )
  })

  it('should render the correct content for "Exemption Recorded" page when the exemption reason is not technical issue', () => {
    // Given
    const model = {
      prisonerSummary,
      nextReviewDate: startOfDay('2024-11-09'),
      exemptionDueToTechnicalIssue: false,
    }
    const content = njkEnv.render('index.njk', model)

    // When
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="warning-text"]').length).toEqual(1)
    expect($('[data-qa="session-on-hold"]').length).toEqual(1)
    expect($('[data-qa="session-on-hold"]').text().trim()).toBe(
      'Ifereeca Peigh is now exempt from reviews and the session is on hold.',
    )
  })
})
