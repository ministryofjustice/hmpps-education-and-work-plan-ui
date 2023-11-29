import moment from 'moment'
import type { Timeline } from 'viewModels'
import filterTimelineEvents from './timelineResolver'

describe('timelineResolver', () => {
  describe('filterTimelineEvents', () => {
    it('should return a Timeline with multiple goal events with the same correlationId value grouped and events sorted by timestamp', () => {
      // Given
      const timeline = {
        prisonNumber: 'A1234AA',
        problemRetrievingData: false,
        events: [
          {
            reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
            sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
            eventType: 'GOAL_CREATED',
            prison: {
              prisonId: 'MDI',
              prisonName: undefined,
            },
            timestamp: moment('2023-09-01T10:47:38.565Z').toDate(),
            correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
            contextualInfo: '',
            actionedByDisplayName: 'Ralph Gen',
          },
          {
            reference: 'df98ea4c-b415-48d9-a600-9068cbaa66f6t',
            sourceReference: '64bc1045-7368-47c4-a261-4d616b7b51b9',
            eventType: 'GOAL_CREATED',
            prison: {
              prisonId: 'MDI',
              prisonName: undefined,
            },
            timestamp: moment('2023-09-01T10:47:38.565Z').toDate(),
            correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
            contextualInfo: '',
            actionedByDisplayName: 'Ralph Gen',
          },
          {
            reference: 'cd98ea4c-b415-48d9-a600-2423cefe65et',
            sourceReference: '44bc1011-4368-47c4-a261-4d515b7b51c9',
            eventType: 'GOAL_CREATED',
            prison: {
              prisonId: 'MDI',
              prisonName: undefined,
            },
            timestamp: moment('2023-10-01T10:47:38.565Z').toDate(),
            correlationId: '524aa049-c5df-459d-8231-bdeab3425c1d',
            contextualInfo: '',
            actionedByDisplayName: 'Ralph Gen',
          },
        ],
      } as Timeline

      const expected = {
        prisonNumber: 'A1234AA',
        problemRetrievingData: false,
        events: [
          {
            reference: 'cd98ea4c-b415-48d9-a600-2423cefe65et',
            sourceReference: '44bc1011-4368-47c4-a261-4d515b7b51c9',
            eventType: 'GOAL_CREATED',
            prison: {
              prisonId: 'MDI',
              prisonName: undefined,
            },
            timestamp: moment('2023-10-01T10:47:38.565Z').toDate(),
            correlationId: '524aa049-c5df-459d-8231-bdeab3425c1d',
            contextualInfo: '',
            actionedByDisplayName: 'Ralph Gen',
          },
          {
            reference: 'df98ea4c-b415-48d9-a600-9068cbaa66f6t',
            sourceReference: '64bc1045-7368-47c4-a261-4d616b7b51b9',
            eventType: 'MULTIPLE_GOALS_CREATED',
            prison: {
              prisonId: 'MDI',
              prisonName: undefined,
            },
            timestamp: moment('2023-09-01T10:47:38.565Z').toDate(),
            correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
            contextualInfo: '',
            actionedByDisplayName: 'Ralph Gen',
          },
        ],
      } as Timeline

      // When
      const actual = filterTimelineEvents(timeline)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return a Timeline with no events given a Timeline with undefined events', () => {
      // Given
      const timeline = {
        prisonNumber: 'A1234AA',
        problemRetrievingData: false,
        events: [],
      } as Timeline

      const expected = {
        prisonNumber: 'A1234AA',
        problemRetrievingData: false,
        events: [],
      } as Timeline

      // When
      const actual = filterTimelineEvents(timeline)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
