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

describe('_timelineEvent-GOAL_COMPLETED', () => {
  it('should display GOAL_COMPLETED timeline event', () => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    const event = aTimelineEvent({
      eventType: 'GOAL_COMPLETED',
      actionedByDisplayName: 'Fred Bloggs',
      prisonName: 'Moorland (HMP & YOI)',
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
    })

    const model = { event, prisonerSummary }

    // When
    const content = nunjucks.render('_timelineEvent-GOAL_COMPLETED.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=GOAL_COMPLETED]').length).toEqual(1)
    expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
    expect($('.moj-timeline__description a').text().trim()).toEqual(`View Jimmy Lightfingers's completed goals`)
  })
})
