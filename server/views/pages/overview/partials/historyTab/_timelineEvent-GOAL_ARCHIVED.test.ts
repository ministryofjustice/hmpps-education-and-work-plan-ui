import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import aTimelineEvent from '../../../../../testsupport/timelineEventTestDataBuilder'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import formatReasonToArchiveGoalFilter from '../../../../../filters/formatReasonToArchiveGoalFilter'
import ReasonToArchiveGoalValue from '../../../../../enums/ReasonToArchiveGoalValue'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatReasonToArchiveGoal', formatReasonToArchiveGoalFilter)

describe('_timelineEvent-GOAL_ARCHIVED', () => {
  it.each([
    ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
    ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_WITH_CIAG,
    ReasonToArchiveGoalValue.SUITABLE_ACTIVITIES_NOT_AVAILABLE_IN_THIS_PRISON,
  ])('should display GOAL_ARCHIVED timeline event with reason %s', (archiveReason: ReasonToArchiveGoalValue) => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    const event = aTimelineEvent({
      eventType: 'GOAL_ARCHIVED',
      actionedByDisplayName: 'Fred Bloggs',
      prisonName: 'Moorland (HMP & YOI)',
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
      contextualInfo: {
        GOAL_ARCHIVED_REASON: archiveReason,
      },
    })

    const model = { event, prisonerSummary }

    // When
    const content = nunjucks.render('_timelineEvent-GOAL_ARCHIVED.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=GOAL_ARCHIVED]').length).toEqual(1)
    expect($(`[data-qa-goal-archive-reason=${archiveReason}]`).length).toEqual(1)
    expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
    expect($('.moj-timeline__description a').text().trim()).toEqual(`View Ifereeca Peigh's archived goals`)
  })

  it('should display GOAL_ARCHIVED timeline event with reason OTHER', () => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    const event = aTimelineEvent({
      eventType: 'GOAL_ARCHIVED',
      actionedByDisplayName: 'Fred Bloggs',
      prisonName: 'Moorland (HMP & YOI)',
      timestamp: parseISO('2023-08-01T10:46:38.565Z'),
      contextualInfo: {
        GOAL_ARCHIVED_REASON: ReasonToArchiveGoalValue.OTHER,
        GOAL_ARCHIVED_REASON_OTHER: 'Prisoner has deceased',
      },
    })

    const model = { event, prisonerSummary }

    // When
    const content = nunjucks.render('_timelineEvent-GOAL_ARCHIVED.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa-event-type=GOAL_ARCHIVED]').length).toEqual(1)
    expect($('[data-qa-goal-archive-reason=OTHER]').length).toEqual(1)
    expect($('.moj-timeline__byline').text().trim()).toEqual('by Fred Bloggs, Moorland (HMP & YOI)')
    expect($('.moj-timeline__date').text().trim()).toEqual('1 August 2023')
    expect($('.moj-timeline__description a').text().trim()).toEqual(`View Ifereeca Peigh's archived goals`)
    expect($('.moj-timeline__description p:first-of-type').text().trim()).toEqual(
      'Reason: Other - Prisoner has deceased',
    )
  })
})
