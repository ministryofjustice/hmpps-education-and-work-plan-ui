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

describe('_timelineEvent-ACTION_PLAN_CREATED', () => {
  describe('Timeline event was created as part of the original Induction journey', () => {
    it('should display ACTION_PLAN_CREATED timeline event', () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      const event = aTimelineEvent({
        eventType: 'ACTION_PLAN_CREATED',
        actionedByDisplayName: 'Fred Bloggs',
        prisonName: 'Moorland (HMP & YOI)',
        timestamp: parseISO('2023-08-01T10:46:38.565Z'),
        contextualInfo: {}, // Original Induction journey did not ask who completed the Induction, when, or any Notes; so there is no contextualInfo for these event types
      })

      const model = { event, prisonerSummary }

      // When
      const content = nunjucks.render('_timelineEvent-ACTION_PLAN_CREATED.njk', model)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa-event-type=ACTION_PLAN_CREATED]').length).toEqual(1)
      expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
      expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
      expect($('.moj-timeline__description a').text().trim()).toEqual(`View Ifereeca Peigh's learning and work plan`)
      expect($('[data-qa=induction-conducted-by]').length).toEqual(0)
      expect($('[data-qa=induction-notes]').length).toEqual(0)
    })
  })

  describe('Timeline event was created as part of the new Induction journey', () => {
    it('should display ACTION_PLAN_CREATED timeline event given session was conducted by someone else and Notes were entered', () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      const event = aTimelineEvent({
        eventType: 'ACTION_PLAN_CREATED',
        actionedByDisplayName: 'Fred Bloggs',
        prisonName: 'Moorland (HMP & YOI)',
        timestamp: parseISO('2023-08-01T10:46:38.565Z'),
        contextualInfo: {
          COMPLETED_INDUCTION_NOTES: 'Some notes about the induction',
          COMPLETED_INDUCTION_ENTERED_ONLINE_BY: 'Fred Bloggs',
          COMPLETED_INDUCTION_CONDUCTED_IN_PERSON_DATE: '2023-07-29',
          COMPLETED_INDUCTION_CONDUCTED_IN_PERSON_BY: 'Alex Smith',
          COMPLETED_INDUCTION_CONDUCTED_IN_PERSON_BY_ROLE: 'Peer mentor',
        },
      })

      const model = { event, prisonerSummary }

      // When
      const content = nunjucks.render('_timelineEvent-ACTION_PLAN_CREATED.njk', model)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa-event-type=ACTION_PLAN_CREATED]').length).toEqual(1)
      expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
      expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
      expect($('.moj-timeline__description a').length).toEqual(0) // The link is only shown for the original timeline events
      expect($('[data-qa=induction-conducted-by]').text().trim()).toEqual(
        'Induction conducted by Alex Smith, Peer mentor, on 29 July 2023',
      )
      expect($('[data-qa=induction-notes]').text().trim()).toEqual('Some notes about the induction')
    })

    it('should display ACTION_PLAN_CREATED timeline event given session was conducted by someone else and no Notes were entered', () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      const event = aTimelineEvent({
        eventType: 'ACTION_PLAN_CREATED',
        actionedByDisplayName: 'Fred Bloggs',
        prisonName: 'Moorland (HMP & YOI)',
        timestamp: parseISO('2023-08-01T10:46:38.565Z'),
        contextualInfo: {
          COMPLETED_INDUCTION_ENTERED_ONLINE_BY: 'Fred Bloggs',
          COMPLETED_INDUCTION_CONDUCTED_IN_PERSON_DATE: '2023-07-29',
          COMPLETED_INDUCTION_CONDUCTED_IN_PERSON_BY: 'Alex Smith',
          COMPLETED_INDUCTION_CONDUCTED_IN_PERSON_BY_ROLE: 'Peer mentor',
        },
      })

      const model = { event, prisonerSummary }

      // When
      const content = nunjucks.render('_timelineEvent-ACTION_PLAN_CREATED.njk', model)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa-event-type=ACTION_PLAN_CREATED]').length).toEqual(1)
      expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
      expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
      expect($('.moj-timeline__description a').length).toEqual(0) // The link is only shown for the original timeline events
      expect($('[data-qa=induction-conducted-by]').text().trim()).toEqual(
        'Induction conducted by Alex Smith, Peer mentor, on 29 July 2023',
      )
      expect($('[data-qa=induction-notes]').length).toEqual(0)
    })

    it('should display ACTION_PLAN_CREATED timeline event given session was not conducted by someone else and Notes were entered', () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      const event = aTimelineEvent({
        eventType: 'ACTION_PLAN_CREATED',
        actionedByDisplayName: 'Fred Bloggs',
        prisonName: 'Moorland (HMP & YOI)',
        timestamp: parseISO('2023-08-01T10:46:38.565Z'),
        contextualInfo: {
          COMPLETED_INDUCTION_NOTES: 'Some notes about the induction',
          COMPLETED_INDUCTION_ENTERED_ONLINE_BY: 'Fred Bloggs',
          COMPLETED_INDUCTION_CONDUCTED_IN_PERSON_DATE: '2023-07-29',
        },
      })

      const model = { event, prisonerSummary }

      // When
      const content = nunjucks.render('_timelineEvent-ACTION_PLAN_CREATED.njk', model)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa-event-type=ACTION_PLAN_CREATED]').length).toEqual(1)
      expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
      expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
      expect($('.moj-timeline__description a').length).toEqual(0) // The link is only shown for the original timeline events
      expect($('[data-qa=induction-conducted-by]').text().trim()).toEqual(
        'Induction conducted by Fred Bloggs, on 29 July 2023',
      )
      expect($('[data-qa=induction-notes]').text().trim()).toEqual('Some notes about the induction')
    })

    it('should display ACTION_PLAN_CREATED timeline event given session was not conducted by someone else and no Notes were entered', () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      const event = aTimelineEvent({
        eventType: 'ACTION_PLAN_CREATED',
        actionedByDisplayName: 'Fred Bloggs',
        prisonName: 'Moorland (HMP & YOI)',
        timestamp: parseISO('2023-08-01T10:46:38.565Z'),
        contextualInfo: {
          COMPLETED_INDUCTION_ENTERED_ONLINE_BY: 'Fred Bloggs',
          COMPLETED_INDUCTION_CONDUCTED_IN_PERSON_DATE: '2023-07-29',
        },
      })

      const model = { event, prisonerSummary }

      // When
      const content = nunjucks.render('_timelineEvent-ACTION_PLAN_CREATED.njk', model)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa-event-type=ACTION_PLAN_CREATED]').length).toEqual(1)
      expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
      expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
      expect($('.moj-timeline__description a').length).toEqual(0) // The link is only shown for the original timeline events
      expect($('[data-qa=induction-conducted-by]').text().trim()).toEqual(
        'Induction conducted by Fred Bloggs, on 29 July 2023',
      )
      expect($('[data-qa=induction-notes]').length).toEqual(0)
    })
  })
})
