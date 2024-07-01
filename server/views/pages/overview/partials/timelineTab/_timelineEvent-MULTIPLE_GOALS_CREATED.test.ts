import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import aTimelineEvent from '../../../../../testsupport/timelineEventTestDataBuilder'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
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

describe('_timelineEvent-MULTIPLE_GOALS_CREATED', () => {
  it('should display MULTIPLE_GOALS_CREATED timeline event', () => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    const event = aTimelineEvent({
      eventType: 'MULTIPLE_GOALS_CREATED',
      actionedByDisplayName: 'Fred Bloggs',
      prison: {
        prisonId: 'MDI',
        prisonName: 'Moorland (HMP & YOI)',
      },
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
    })

    const model = { event, prisonerSummary }

    // When
    const content = nunjucks.render('_timelineEvent-MULTIPLE_GOALS_CREATED.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=MULTIPLE_GOALS_CREATED]').length).toEqual(1)
    expect($('.moj-timeline__title').text().trim()).toEqual('Goals added')
    expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
    expect($('.moj-timeline__description a').text().trim()).toEqual(`View Jimmy Lightfingers's goals`)
  })

  it('should display MULTIPLE_GOALS_CREATED timeline event given prison name not looked up', () => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    const event = aTimelineEvent({
      eventType: 'MULTIPLE_GOALS_CREATED',
      actionedByDisplayName: 'Fred Bloggs',
      prison: {
        prisonId: 'MDI',
        prisonName: undefined,
      },
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
    })

    const model = { event, prisonerSummary }

    // When
    const content = nunjucks.render('_timelineEvent-MULTIPLE_GOALS_CREATED.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=MULTIPLE_GOALS_CREATED]').length).toEqual(1)
    expect($('.moj-timeline__title').text().trim()).toEqual('Goals added')
    expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, MDI')
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
    expect($('.moj-timeline__description a').text().trim()).toEqual(`View Jimmy Lightfingers's goals`)
  })
})
