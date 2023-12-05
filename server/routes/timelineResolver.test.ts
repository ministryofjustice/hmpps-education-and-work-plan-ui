import moment from 'moment'
import type { Timeline, TimelineEvent } from 'viewModels'
import filterTimelineEvents from './timelineResolver'

describe('timelineResolver', () => {
  describe('filterTimelineEvents', () => {
    it('should return a Timeline with multiple goal events with the same correlationId value grouped and events sorted by timestamp', () => {
      // Given
      const correlationIdForActionPlanAndGoalCreateEvents = '246aa049-c5df-459d-8231-bdeab3936d0f'
      const actionPlanCreatedEvent: TimelineEvent = {
        correlationId: correlationIdForActionPlanAndGoalCreateEvents,
        reference: 'd03646e7-d145-41cc-862b-c5802e53b541',
        sourceReference: '4d2558d3-dbd5-43cb-a14c-c95dacec09a1',
        eventType: 'ACTION_PLAN_CREATED',
        prison: {
          prisonId: 'MDI',
          prisonName: undefined,
        },
        timestamp: moment('2023-09-01T10:47:38.560Z').toDate(),
        contextualInfo: '',
        actionedByDisplayName: 'Ralph Gen',
      }
      const actionPlanGoalCreateEvents: Array<TimelineEvent> = [
        {
          correlationId: correlationIdForActionPlanAndGoalCreateEvents,
          reference: 'd5b57b83-92f8-4de9-b97c-e421e0468069',
          sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
          eventType: 'GOAL_CREATED',
          prison: {
            prisonId: 'MDI',
            prisonName: undefined,
          },
          timestamp: moment('2023-09-01T10:47:38.560Z').toDate(),
          contextualInfo: '',
          actionedByDisplayName: 'Ralph Gen',
        },
        {
          correlationId: correlationIdForActionPlanAndGoalCreateEvents,
          reference: '07744aae-55da-4b96-a10f-ca53ba3da6c5',
          sourceReference: '64bc1045-7368-47c4-a261-4d616b7b51b9',
          eventType: 'GOAL_CREATED',
          prison: {
            prisonId: 'MDI',
            prisonName: undefined,
          },
          timestamp: moment('2023-09-01T10:47:38.560Z').toDate(),
          contextualInfo: '',
          actionedByDisplayName: 'Ralph Gen',
        },
      ]

      const singleGoalCreateEvent: TimelineEvent = {
        correlationId: '524aa049-c5df-459d-8231-bdeab3425c1d',
        reference: '3910997a-a027-47c3-ac5f-32eb5760a118',
        sourceReference: '44bc1011-4368-47c4-a261-4d515b7b51c9',
        eventType: 'GOAL_CREATED',
        prison: {
          prisonId: 'MDI',
          prisonName: undefined,
        },
        timestamp: moment('2023-10-01T10:47:38.565Z').toDate(),
        contextualInfo: '',
        actionedByDisplayName: 'Ralph Gen',
      }
      const inductionUpdateEvent: TimelineEvent = {
        correlationId: 'b84b29ab-3090-4900-a985-dfd714bd43a1',
        reference: '49da03d3-11fe-4d34-ba8c-10a5af9e82d8',
        sourceReference: '4d2558d3-dbd5-43cb-a14c-c95dacec09a1',
        eventType: 'INDUCTION_UPDATED',
        prison: {
          prisonId: 'MDI',
          prisonName: undefined,
        },
        timestamp: moment('2023-10-01T12:12:02.014Z').toDate(),
        contextualInfo: '',
        actionedByDisplayName: 'Ralph Gen',
      }
      const goalUpdateEvent: TimelineEvent = {
        correlationId: '17e2f437-310b-4f6c-8c44-74de43dbc35d',
        reference: 'ce9e9872-6104-4b61-a056-2b2eca31b9aa',
        sourceReference: '64bc1045-7368-47c4-a261-4d616b7b51b9',
        eventType: 'GOAL_UPDATED',
        prison: {
          prisonId: 'MDI',
          prisonName: undefined,
        },
        timestamp: moment('2023-10-02T09:54:13.987Z').toDate(),
        contextualInfo: '',
        actionedByDisplayName: 'Ralph Gen',
      }

      const otherEvents: Array<TimelineEvent> = [singleGoalCreateEvent, inductionUpdateEvent, goalUpdateEvent]

      const timeline: Timeline = {
        prisonNumber: 'A1234AA',
        problemRetrievingData: false,
        events: [...actionPlanGoalCreateEvents, actionPlanCreatedEvent, ...otherEvents],
      }

      const expected: Timeline = {
        prisonNumber: 'A1234AA',
        problemRetrievingData: false,
        events: [
          goalUpdateEvent,
          inductionUpdateEvent,
          singleGoalCreateEvent,
          {
            correlationId: correlationIdForActionPlanAndGoalCreateEvents,
            reference: '07744aae-55da-4b96-a10f-ca53ba3da6c5',
            sourceReference: '64bc1045-7368-47c4-a261-4d616b7b51b9',
            eventType: 'MULTIPLE_GOALS_CREATED',
            prison: {
              prisonId: 'MDI',
              prisonName: undefined,
            },
            timestamp: moment('2023-09-01T10:47:38.560Z').toDate(),
            contextualInfo: '',
            actionedByDisplayName: 'Ralph Gen',
          },
          actionPlanCreatedEvent,
        ],
      }

      // When
      const actual = filterTimelineEvents(timeline)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return a Timeline with no events given a Timeline with undefined events', () => {
      // Given
      const timeline: Timeline = {
        prisonNumber: 'A1234AA',
        problemRetrievingData: false,
        events: [],
      }

      const expected: Timeline = {
        prisonNumber: 'A1234AA',
        problemRetrievingData: false,
        events: [],
      }

      // When
      const actual = filterTimelineEvents(timeline)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  it('should return a Timeline with no events given a Timeline with problem retrieving data', () => {
    // Given
    const timeline: Timeline = {
      prisonNumber: 'A1234AA',
      problemRetrievingData: true,
      events: [],
    }

    const expected: Timeline = {
      prisonNumber: 'A1234AA',
      problemRetrievingData: true,
      events: [],
    }

    // When
    const actual = filterTimelineEvents(timeline)

    // Then
    expect(actual).toEqual(expected)
  })
})
