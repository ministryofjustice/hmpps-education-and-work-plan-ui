import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidTimeline from '../../../../../testsupport/timelineTestDataBuilder'
import aTimelineEvent from '../../../../../testsupport/timelineEventTestDataBuilder'

describe('timelineTabContents', () => {
  const njkEnv = nunjucks.configure([
    'node_modules/govuk-frontend/dist/',
    'node_modules/@ministryofjustice/frontend/',
    'server/views/',
    __dirname,
  ])
  njkEnv //
    .addFilter('formatDate', formatDateFilter)

  it('should render a timeline event for each supported timeline event type', () => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    const timeline = aValidTimeline({
      events: [
        // supported event types
        aTimelineEvent({ eventType: 'ACTION_PLAN_CREATED' }),
        aTimelineEvent({ eventType: 'GOAL_CREATED' }),
        aTimelineEvent({ eventType: 'GOAL_UPDATED' }),
        aTimelineEvent({ eventType: 'INDUCTION_UPDATED' }),
        aTimelineEvent({ eventType: 'MULTIPLE_GOALS_CREATED' }),
        aTimelineEvent({ eventType: 'PRISON_ADMISSION' }),
        aTimelineEvent({ eventType: 'PRISON_TRANSFER' }),
        aTimelineEvent({ eventType: 'PRISON_RELEASE' }),
        // event types that are not supported in the UI rendering
        aTimelineEvent({ eventType: 'GOAL_ARCHIVED' }),
        aTimelineEvent({ eventType: 'GOAL_UNARCHIVED' }),
        aTimelineEvent({ eventType: 'INDUCTION_CREATED' }),
        aTimelineEvent({ eventType: 'GOAL_COMPLETED' }),
        aTimelineEvent({ eventType: 'STEP_UPDATED' }),
        aTimelineEvent({ eventType: 'STEP_NOT_STARTED' }),
        aTimelineEvent({ eventType: 'STEP_STARTED' }),
        aTimelineEvent({ eventType: 'STEP_COMPLETED' }),
        aTimelineEvent({ eventType: 'CONVERSATION_CREATED' }),
        aTimelineEvent({ eventType: 'CONVERSATION_UPDATED' }),
      ],
    })

    const model = { prisonerSummary, timeline }

    // When
    const content = nunjucks.render('timelineTabContents.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type]').length).toEqual(8)
    expect($('[data-qa-event-type=ACTION_PLAN_CREATED]').length).toEqual(1)
    expect($('[data-qa-event-type=GOAL_CREATED]').length).toEqual(1)
    expect($('[data-qa-event-type=GOAL_UPDATED]').length).toEqual(1)
    expect($('[data-qa-event-type=MULTIPLE_GOALS_CREATED]').length).toEqual(1)
    expect($('[data-qa-event-type=PRISON_ADMISSION]').length).toEqual(1)
    expect($('[data-qa-event-type=PRISON_TRANSFER]').length).toEqual(1)
    expect($('[data-qa-event-type=PRISON_RELEASE]').length).toEqual(1)
  })

  it('should render empty timeline message given timeline with no events', () => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    const timeline = aValidTimeline({ events: [] })

    const model = { prisonerSummary, timeline }

    // When
    const content = nunjucks.render('timelineTabContents.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type]').length).toEqual(0)
    expect($('[data-qa=empty-timeline-message]').length).toEqual(1)
  })

  it('should render timeline unavailable message given problem retrieving data', () => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    const timeline = aValidTimeline({ problemRetrievingData: true })

    const model = { prisonerSummary, timeline }

    // When
    const content = nunjucks.render('timelineTabContents.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type]').length).toEqual(0)
    expect($('[data-qa=timeline-unavailable-message]').length).toEqual(1)
  })
})
