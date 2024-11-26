import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import formatDate from '../../../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'

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
const template = '_sessionHistorySummaryCard.njk'

describe('_sessionHistorySummaryCard', () => {
  it('should render session history summary card correctly given prisoner has had sessions', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      sessionHistory: {
        problemRetrievingData: false,
        counts: {
          totalSessions: 3,
          reviewSessions: 2,
          inductionSessions: 1,
        },
        lastSessionConductedBy: 'Elaine Benes',
        lastSessionConductedAt: new Date('2024-01-21T13:42:01.401Z'),
        lastSessionConductedAtPrison: 'Brixton (HMP)',
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="action-plan-reviews-count"]').text().trim()).toEqual('3')
    expect($('[data-qa="induction-or-review-last-updated-hint"]').text().trim()).toEqual(
      'Updated on 21 January 2024 by Elaine Benes, Brixton (HMP)',
    )
    expect($('[data-qa="view-timeline-button"]').attr('href')).toEqual(
      `/plan/${prisonerSummary.prisonNumber}/view/timeline`,
    )
    expect($('[data-qa="action-plan-reviews-data-unavailable-message"]').length).toEqual(0)
  })

  it('should render session history summary card correctly given prisoner has had no sessions', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      sessionHistory: {
        problemRetrievingData: false,
        counts: {
          totalSessions: 0,
          reviewSessions: 0,
          inductionSessions: 0,
        },
        lastSessionConductedBy: undefined as string,
        lastSessionConductedAt: undefined as string,
        lastSessionConductedAtPrison: undefined as string,
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="action-plan-reviews-count"]').text().trim()).toEqual('0')
    expect($('[data-qa="induction-or-review-last-updated-hint"]').length).toEqual(0)
    expect($('[data-qa="view-timeline-button"]').attr('href')).toEqual(
      `/plan/${prisonerSummary.prisonNumber}/view/timeline`,
    )
    expect($('[data-qa="action-plan-reviews-data-unavailable-message"]').length).toEqual(0)
  })

  it('should render session history summary card correctly given problem retrieving review session history data', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      sessionHistory: {
        problemRetrievingData: true,
        counts: {
          totalSessions: 0,
          reviewSessions: 0,
          inductionSessions: 0,
        },
        lastSessionConductedBy: undefined as string,
        lastSessionConductedAt: undefined as string,
        lastSessionConductedAtPrison: undefined as string,
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="action-plan-reviews-count"]').length).toEqual(0)
    expect($('[data-qa="induction-or-review-last-updated-hint"]').length).toEqual(0)
    expect($('[data-qa="view-timeline-button"]').length).toEqual(0)
    expect($('[data-qa="action-plan-reviews-data-unavailable-message"]').length).toEqual(1)
  })
})
