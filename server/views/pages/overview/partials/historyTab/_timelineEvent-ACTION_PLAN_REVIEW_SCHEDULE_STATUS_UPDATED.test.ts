import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import aTimelineEvent from '../../../../../testsupport/timelineEventTestDataBuilder'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import formatReviewExemptionReasonFilter from '../../../../../filters/formatReviewExemptionReasonFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatReviewExemptionReason', formatReviewExemptionReasonFilter)

describe('_timelineEvent-ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED', () => {
  it('should display ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED timeline event given the review has been exempted with a user entered note', () => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    const event = aTimelineEvent({
      eventType: 'ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED',
      actionedByDisplayName: 'Fred Bloggs',
      prisonName: 'Moorland (HMP & YOI)',
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
      contextualInfo: {
        REVIEW_SCHEDULE_STATUS_NEW: 'EXEMPT_PRISONER_FAILED_TO_ENGAGE',
        REVIEW_SCHEDULE_STATUS_OLD: 'SCHEDULED',
        REVIEW_SCHEDULE_EXEMPTION_REASON: 'Prisoner refused to leave his cell today',
      },
    })

    const model = { event, prisonerSummary }

    // When
    const content = nunjucks.render('_timelineEvent-ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED]').length).toEqual(1)
    expect($('.moj-timeline__title').text().trim()).toEqual('Exemption recorded')
    expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
    expect($('[data-qa=review-exempted-reason]').text().trim()).toEqual(
      `Reason: Has failed to engage or cooperate for a reason outside contractor's control`,
    )
    expect($('[data-qa=review-exemption-notes]').text().trim()).toEqual('Prisoner refused to leave his cell today')
  })

  it('should display ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED timeline event given the review has been exempted without a user entered note', () => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    const event = aTimelineEvent({
      eventType: 'ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED',
      actionedByDisplayName: 'Fred Bloggs',
      prisonName: 'Moorland (HMP & YOI)',
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
      contextualInfo: {
        REVIEW_SCHEDULE_STATUS_NEW: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
        REVIEW_SCHEDULE_STATUS_OLD: 'SCHEDULED',
      },
    })

    const model = { event, prisonerSummary }

    // When
    const content = nunjucks.render('_timelineEvent-ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED]').length).toEqual(1)
    expect($('.moj-timeline__title').text().trim()).toEqual('Exemption recorded')
    expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
    expect($('[data-qa=review-exempted-reason]').text().trim()).toEqual(
      `Reason: Has a drug or alcohol dependency and is in assessment or treatment`,
    )
    expect($('[data-qa=review-exemption-notes]').length).toEqual(0)
  })

  it('should display ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED timeline event given the review exemption has been removed', () => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    const event = aTimelineEvent({
      eventType: 'ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED',
      actionedByDisplayName: 'Fred Bloggs',
      prisonName: 'Moorland (HMP & YOI)',
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
      contextualInfo: {
        REVIEW_SCHEDULE_STATUS_NEW: 'SCHEDULED',
        REVIEW_SCHEDULE_STATUS_OLD: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
      },
    })

    const model = { event, prisonerSummary }

    // When
    const content = nunjucks.render('_timelineEvent-ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED]').length).toEqual(1)
    expect($('.moj-timeline__title').text().trim()).toEqual('Exemption removed')
    expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
    expect($('[data-qa=review-exempted-reason]').length).toEqual(0)
    expect($('[data-qa=review-exemption-notes]').length).toEqual(0)
  })

  it('should not display ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED timeline event given the review has been completed', () => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    const event = aTimelineEvent({
      eventType: 'ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED',
      actionedByDisplayName: 'Fred Bloggs',
      prisonName: 'Moorland (HMP & YOI)',
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
      contextualInfo: {
        REVIEW_SCHEDULE_STATUS_NEW: 'COMPLETED',
        REVIEW_SCHEDULE_STATUS_OLD: 'SCHEDULED',
      },
    })

    const model = { event, prisonerSummary }

    // When
    const content = nunjucks.render('_timelineEvent-ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED]').length).toEqual(0)
  })
})
