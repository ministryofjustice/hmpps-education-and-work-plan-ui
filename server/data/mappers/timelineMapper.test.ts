import moment from 'moment'
import type { TimelineResponse, TimelineEventResponse } from 'educationAndWorkPlanApiClient'
import type { Timeline, TimelineEvent } from 'viewModels'
import { toTimeline, toTimelineEvent } from './timelineMapper'

describe('timelineMapper', () => {
  it('should map to Timeline', () => {
    // Given
    const timeline: TimelineResponse = {
      prisonNumber: 'A1234AA',
      events: [
        {
          reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
          sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
          eventType: 'ACTION_PLAN_CREATED',
          prisonId: 'MDI',
          actionedBy: 'RALPH_GEN',
          timestamp: '2023-09-01T10:47:38.565Z',
          correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
          contextualInfo: {},
          actionedByDisplayName: 'Ralph Gen',
        },
      ],
    }

    const expectedTimeline: Timeline = {
      problemRetrievingData: false,
      prisonNumber: 'A1234AA',
      events: [
        {
          reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
          sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
          eventType: 'ACTION_PLAN_CREATED',
          prison: {
            prisonId: 'MDI',
            prisonName: undefined,
          },
          timestamp: moment('2023-09-01T10:47:38.565Z').toDate(),
          correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
          contextualInfo: {},
          actionedByDisplayName: 'Ralph Gen',
        },
      ],
    }

    // When
    const actual = toTimeline(timeline)

    // Then
    expect(actual).toEqual(expectedTimeline)
  })

  it('should map to a Timeline event', () => {
    // Given
    const timelineEvent: TimelineEventResponse = {
      reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
      sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
      eventType: 'ACTION_PLAN_CREATED',
      prisonId: 'MDI',
      actionedBy: 'RALPH_GEN',
      timestamp: '2023-09-01T10:47:38.565Z',
      correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
      contextualInfo: {},
      actionedByDisplayName: 'Ralph Gen',
    }

    const expectedTimelineEvent: TimelineEvent = {
      reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
      sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
      eventType: 'ACTION_PLAN_CREATED',
      prison: {
        prisonId: 'MDI',
        prisonName: undefined,
      },
      timestamp: moment('2023-09-01T10:47:38.565Z').toDate(),
      correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
      contextualInfo: {},
      actionedByDisplayName: 'Ralph Gen',
    }

    // When
    const actual = toTimelineEvent(timelineEvent)

    // Then
    expect(actual).toEqual(expectedTimelineEvent)
  })
})
