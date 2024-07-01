import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import aTimelineEvent from '../../../../../testsupport/timelineEventTestDataBuilder'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import formatTimelineEventFilter from '../../../../../filters/formatTimelineEventFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatTimelineEvent', formatTimelineEventFilter)

describe('_timelineEvent-INDUCTION_UPDATED', () => {
  it('should display INDUCTION_UPDATED timeline event', () => {
    // Given
    const event = aTimelineEvent({
      eventType: 'INDUCTION_UPDATED',
      actionedByDisplayName: 'Fred Bloggs',
      prison: {
        prisonId: 'MDI',
        prisonName: 'Moorland (HMP & YOI)',
      },
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
    })

    const model = { event }

    // When
    const content = nunjucks.render('_timelineEvent-INDUCTION_UPDATED.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=INDUCTION_UPDATED]').length).toEqual(1)
    expect($('.moj-timeline__title').text().trim()).toEqual('Learning and work progress plan updated')
    expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
  })

  it('should display INDUCTION_UPDATED timeline event given prison name not looked up', () => {
    // Given
    const event = aTimelineEvent({
      eventType: 'INDUCTION_UPDATED',
      actionedByDisplayName: 'Fred Bloggs',
      prison: {
        prisonId: 'MDI',
        prisonName: undefined,
      },
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
    })

    const model = { event }

    // When
    const content = nunjucks.render('_timelineEvent-INDUCTION_UPDATED.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=INDUCTION_UPDATED]').length).toEqual(1)
    expect($('.moj-timeline__title').text().trim()).toEqual('Learning and work progress plan updated')
    expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, MDI')
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
  })
})
