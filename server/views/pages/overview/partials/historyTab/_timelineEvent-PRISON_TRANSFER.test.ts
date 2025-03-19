import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import aTimelineEvent from '../../../../../testsupport/timelineEventTestDataBuilder'
import formatDateFilter from '../../../../../filters/formatDateFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv //
  .addFilter('formatDate', formatDateFilter)

describe('_timelineEvent-PRISON_TRANSFER', () => {
  it('should display PRISON_TRANSFER timeline event', () => {
    // Given
    const event = aTimelineEvent({
      eventType: 'PRISON_TRANSFER',
      actionedByDisplayName: 'Fred Bloggs',
      prisonName: 'Moorland (HMP & YOI)',
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
      contextualInfo: {
        PRISON_TRANSFERRED_FROM: 'Rochester (HMP & YOI)',
      },
    })

    const model = { event }

    // When
    const content = nunjucks.render('_timelineEvent-PRISON_TRANSFER.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=PRISON_TRANSFER]').length).toEqual(1)
    expect($('.moj-timeline__title').text().trim()).toEqual(
      'Transferred to Moorland (HMP & YOI) from Rochester (HMP & YOI)',
    )
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
  })

  it('should display PRISON_TRANSFER timeline event given previous prison name not looked up', () => {
    // Given
    const event = aTimelineEvent({
      eventType: 'PRISON_TRANSFER',
      actionedByDisplayName: 'Fred Bloggs',
      prisonName: 'Moorland (HMP & YOI)',
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
      contextualInfo: {
        PRISON_TRANSFERRED_FROM: 'RCI',
      },
    })

    const model = { event }

    // When
    const content = nunjucks.render('_timelineEvent-PRISON_TRANSFER.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=PRISON_TRANSFER]').length).toEqual(1)
    expect($('.moj-timeline__title').text().trim()).toEqual('Transferred to Moorland (HMP & YOI) from RCI')
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
  })
})
