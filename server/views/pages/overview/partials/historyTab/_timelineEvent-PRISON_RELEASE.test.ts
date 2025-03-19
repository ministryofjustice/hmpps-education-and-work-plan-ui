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

describe('_timelineEvent-PRISON_RELEASE', () => {
  it('should display PRISON_RELEASE timeline event', () => {
    // Given
    const event = aTimelineEvent({
      eventType: 'PRISON_RELEASE',
      actionedByDisplayName: 'Fred Bloggs',
      prisonName: 'Moorland (HMP & YOI)',
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
    })

    const model = { event }

    // When
    const content = nunjucks.render('_timelineEvent-PRISON_RELEASE.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=PRISON_RELEASE]').length).toEqual(1)
    expect($('.moj-timeline__title').text().trim()).toEqual('Released from Moorland (HMP & YOI)')
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
  })
})
