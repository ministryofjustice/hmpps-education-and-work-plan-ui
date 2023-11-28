import type { TimelineResponse } from 'educationAndWorkPlanApiClient'
import filterTimelineEvents from './timelineResolver'

describe('timelineResolver', () => {
  describe('filterTimelineEvents', () => {
    it('should return Timeline events with MULTIPLE_GOALS_CREATED with the same correlationId value grouped and events sorted by timestamp', () => {
      // Given
      const timelineResponse = {
        events: [
          {
            eventType: 'GOAL_CREATED',
            timestamp: '2023-01-01T00:00:00.000Z',
            correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
          },
          {
            timestamp: '2023-01-01T00:00:00.000Z',
            eventType: 'GOAL_CREATED',
            correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
          },
          {
            timestamp: '2023-01-02T00:00:00.000Z',
            eventType: 'GOAL_CREATED',
            correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
          },
        ],
      } as TimelineResponse

      const expected = {
        events: [
          {
            timestamp: '2023-01-02T00:00:00.000Z',
            eventType: 'GOAL_CREATED',
            correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
          },
          {
            eventType: 'MULTIPLE_GOALS_CREATED',
            timestamp: '2023-01-01T00:00:00.000Z',
            correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
          },
        ],
      } as TimelineResponse

      // When
      const actual = filterTimelineEvents(timelineResponse)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
