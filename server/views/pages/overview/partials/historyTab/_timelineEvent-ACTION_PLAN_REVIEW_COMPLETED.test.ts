import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import aTimelineEvent from '../../../../../testsupport/timelineEventTestDataBuilder'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDateFilter from '../../../../../filters/formatDateFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv //
  .addFilter('formatDate', formatDateFilter)

describe('_timelineEvent-ACTION_PLAN_REVIEW_COMPLETED', () => {
  it('should display ACTION_PLAN_REVIEW_COMPLETED timeline event given the review was not conducted by someone else', () => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    const event = aTimelineEvent({
      eventType: 'ACTION_PLAN_REVIEW_COMPLETED',
      actionedByDisplayName: 'Fred Bloggs',
      prisonName: 'Moorland (HMP & YOI)',
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
      contextualInfo: {
        COMPLETED_REVIEW_NOTES: 'Some notes about the review',
        COMPLETED_REVIEW_ENTERED_ONLINE_BY: 'Fred Bloggs',
        COMPLETED_REVIEW_CONDUCTED_IN_PERSON_DATE: '2023-07-29',
      },
    })

    const model = { event, prisonerSummary }

    // When
    const content = nunjucks.render('_timelineEvent-ACTION_PLAN_REVIEW_COMPLETED.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=ACTION_PLAN_REVIEW_COMPLETED]').length).toEqual(1)
    expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
    expect($('[data-qa=review-notes]').text().trim()).toEqual('Some notes about the review')
    expect($('[data-qa=review-conducted-by]').text().trim()).toEqual('Review conducted by Fred Bloggs on 29 July 2023')
  })

  it('should display ACTION_PLAN_REVIEW_COMPLETED timeline event given the review was conducted by someone else', () => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    const event = aTimelineEvent({
      eventType: 'ACTION_PLAN_REVIEW_COMPLETED',
      actionedByDisplayName: 'Fred Bloggs',
      prisonName: 'Moorland (HMP & YOI)',
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
      contextualInfo: {
        COMPLETED_REVIEW_NOTES: 'Some notes about the review',
        COMPLETED_REVIEW_ENTERED_ONLINE_BY: 'Fred Bloggs',
        COMPLETED_REVIEW_CONDUCTED_IN_PERSON_DATE: '2023-07-29',
        COMPLETED_REVIEW_CONDUCTED_IN_PERSON_BY: 'Alex Smith',
        COMPLETED_REVIEW_CONDUCTED_IN_PERSON_BY_ROLE: 'Peer mentor',
      },
    })

    const model = { event, prisonerSummary }

    // When
    const content = nunjucks.render('_timelineEvent-ACTION_PLAN_REVIEW_COMPLETED.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=ACTION_PLAN_REVIEW_COMPLETED]').length).toEqual(1)
    expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
    expect($('[data-qa=review-notes]').text().trim()).toEqual('Some notes about the review')
    expect($('[data-qa=review-conducted-by]').text().trim()).toEqual(
      'Review conducted by Alex Smith, Peer mentor, on 29 July 2023',
    )
  })
})
