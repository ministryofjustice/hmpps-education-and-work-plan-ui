import { parseISO } from 'date-fns'
import type { Timeline, TimelineEvent } from 'viewModels'
import TimelineFilterTypeValue from '../enums/timelineFilterTypeValue'

export default function aValidTimeline(options?: {
  reference?: string
  prisonNumber?: string
  events?: Array<TimelineEvent>
  problemRetrievingData?: boolean
  filteredBy?: Array<TimelineFilterTypeValue>
}): Timeline {
  return {
    problemRetrievingData:
      !options || options.problemRetrievingData === null || options.problemRetrievingData === undefined
        ? false
        : options.problemRetrievingData,
    reference: options?.reference || '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
    prisonNumber: options?.prisonNumber || 'A1234BC',
    events: options?.events || [
      {
        reference: 'f49a3412-df7f-41d2-ac04-ffd35e453af4',
        sourceReference: '1211013',
        eventType: 'PRISON_ADMISSION',
        prisonName: 'MDI',
        timestamp: parseISO('2023-08-01T10:46:38.565Z'),
        correlationId: '6457a634-6dbe-4179-983b-74e92883232c',
        contextualInfo: {},
        actionedByDisplayName: undefined,
      },
      {
        reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
        sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
        eventType: 'ACTION_PLAN_CREATED',
        prisonName: 'MDI',
        timestamp: parseISO('2023-09-01T10:47:38.565Z'),
        correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
        contextualInfo: {},
        actionedByDisplayName: 'Ralph Gen',
      },
      {
        reference: '3f0423e5-200b-48c9-8414-f04e336897ff',
        sourceReference: 'f190e844-3aa1-4f04-81d5-6be2bf9721cc',
        eventType: 'GOAL_CREATED',
        prisonName: 'MDI',
        timestamp: parseISO('2023-09-23T15:47:38.565Z'),
        correlationId: '0838330d-606f-480a-b55f-3228e1be122d',
        contextualInfo: {
          GOAL_TITLE: 'Learn French',
        },
        actionedByDisplayName: 'Ralph Gen',
      },
      {
        reference: '0a5d6abf-3504-4bb1-840b-370e3f35cd44',
        sourceReference: 'f190e844-3aa1-4f04-81d5-6be2bf9721cc',
        eventType: 'GOAL_UPDATED',
        prisonName: 'MDI',
        timestamp: parseISO('2023-09-24T08:47:38.565Z'),
        correlationId: '9805d096-cd52-406b-84b0-f4c1d735f3bd',
        contextualInfo: {
          GOAL_TITLE: 'Learn French',
        },
        actionedByDisplayName: 'Ralph Gen',
      },
      {
        reference: '2589e577-64cf-4050-aff1-c2a28086e452',
        sourceReference: '1211013',
        eventType: 'PRISON_TRANSFER',
        prisonName: 'BXI',
        timestamp: parseISO('2023-10-01T10:46:38.565Z'),
        correlationId: 'd2b08b98-77f6-4351-ac60-8c595075f809',
        contextualInfo: {
          PRISON_TRANSFERRED_FROM: 'MDI',
        },
        actionedByDisplayName: undefined,
      },
      {
        reference: 'b046eccc-eadc-4351-8e2c-c5da12fca973',
        sourceReference: '93646ba2-d0f9-42a9-9f87-3eb985ab6fe9',
        eventType: 'GOAL_UPDATED',
        prisonName: 'BXI',
        timestamp: parseISO('2023-11-29T18:47:38.565Z'),
        correlationId: 'db35c8d4-d5c3-4ec8-8554-a3e31f099b3a',
        contextualInfo: {
          GOAL_TITLE: 'Learn French',
        },
        actionedByDisplayName: 'Ralph Gen',
      },
      {
        reference: '12f45f57-72e8-484a-8325-137507214634',
        sourceReference: '1211013',
        eventType: 'PRISON_RELEASE',
        prisonName: 'BXI',
        timestamp: parseISO('2023-12-01T10:46:38.565Z'),
        correlationId: '7e82200d-6251-4d38-9207-1ce49650dedf',
        contextualInfo: {},
        actionedByDisplayName: undefined,
      },
      {
        reference: '8d16c91e-58d3-4fc6-9820-75ae7395eaf2',
        sourceReference: '1211014',
        eventType: 'PRISON_ADMISSION',
        prisonName: 'MDI',
        timestamp: parseISO('2024-01-01T10:46:38.565Z'),
        correlationId: '94e445d5-e4fa-4e32-93f5-0e5d6e3dbb2d',
        contextualInfo: {},
        actionedByDisplayName: undefined,
      },
    ],
    filteredBy: options?.filteredBy || [TimelineFilterTypeValue.ALL],
  }
}
