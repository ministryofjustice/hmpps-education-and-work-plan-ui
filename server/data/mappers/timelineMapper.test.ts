import { parseISO } from 'date-fns'
import type { TimelineResponse, TimelineEventResponse } from 'educationAndWorkPlanApiClient'
import type { Timeline } from 'viewModels'
import toTimeline from './timelineMapper'

describe('timelineMapper', () => {
  it('should map to Timeline', () => {
    // Given
    const timeline: TimelineResponse = {
      prisonNumber: 'A1234AA',
      reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
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
      reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
      events: [
        {
          reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
          sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
          eventType: 'ACTION_PLAN_CREATED',
          prison: {
            prisonId: 'MDI',
            prisonName: undefined,
          },
          timestamp: parseISO('2023-09-01T10:47:38.565Z'),
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

  it('should filter event types not supported by the UI when mapping', () => {
    // Given
    const templateTimelineEventResponse: TimelineEventResponse = {
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

    const timeline: TimelineResponse = {
      prisonNumber: 'A1234AA',
      reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
      events: [
        // events array contains one of all possible event types support by and returned from the API
        { ...templateTimelineEventResponse, eventType: 'INDUCTION_CREATED' },
        { ...templateTimelineEventResponse, eventType: 'INDUCTION_UPDATED' },
        { ...templateTimelineEventResponse, eventType: 'ACTION_PLAN_CREATED' },
        { ...templateTimelineEventResponse, eventType: 'GOAL_CREATED' },
        { ...templateTimelineEventResponse, eventType: 'GOAL_UPDATED' },
        { ...templateTimelineEventResponse, eventType: 'GOAL_STARTED' },
        { ...templateTimelineEventResponse, eventType: 'GOAL_COMPLETED' },
        { ...templateTimelineEventResponse, eventType: 'GOAL_ARCHIVED' },
        { ...templateTimelineEventResponse, eventType: 'STEP_UPDATED' },
        { ...templateTimelineEventResponse, eventType: 'STEP_NOT_STARTED' },
        { ...templateTimelineEventResponse, eventType: 'STEP_STARTED' },
        { ...templateTimelineEventResponse, eventType: 'STEP_COMPLETED' },
        { ...templateTimelineEventResponse, eventType: 'CONVERSATION_CREATED' },
        { ...templateTimelineEventResponse, eventType: 'CONVERSATION_UPDATED' },
        { ...templateTimelineEventResponse, eventType: 'PRISON_ADMISSION' },
        { ...templateTimelineEventResponse, eventType: 'PRISON_RELEASE' },
        { ...templateTimelineEventResponse, eventType: 'PRISON_TRANSFER' },
      ],
    }

    const expectedMappedEventTypes = [
      'INDUCTION_UPDATED',
      'ACTION_PLAN_CREATED',
      'GOAL_CREATED',
      'GOAL_UPDATED',
      'PRISON_ADMISSION',
      'PRISON_RELEASE',
      'PRISON_TRANSFER',
    ]

    // When
    const actual = toTimeline(timeline)

    // Then
    const mappedTimelineEventTypes = actual.events.map(event => event.eventType)
    expect(mappedTimelineEventTypes).toStrictEqual(expectedMappedEventTypes)
  })
})
