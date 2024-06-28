import { parseISO } from 'date-fns'
import type { TimelineResponse } from 'educationAndWorkPlanApiClient'
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
})
