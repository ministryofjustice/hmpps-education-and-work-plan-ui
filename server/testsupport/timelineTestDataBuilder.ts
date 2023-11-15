import type { Timeline } from 'viewModels'

export default function aValidTimelineResponse(): Timeline {
  return {
    reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
    prisonNumber: 'A1234BC',
    events: [
      {
        reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
        sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
        eventType: 'ACTION_PLAN_CREATED',
        prisonId: 'MDI',
        actionedBy: 'RALPH_GEN',
        timestamp: '2023-09-01T10:47:38.565Z',
        correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
        contextualInfo: '',
        actionedByDisplayName: 'Ralph Gen',
      },
      {
        reference: '3f0423e5-200b-48c9-8414-f04e336897ff',
        sourceReference: 'f190e844-3aa1-4f04-81d5-6be2bf9721cc',
        eventType: 'GOAL_CREATED',
        prisonId: 'MDI',
        actionedBy: 'RALPH_GEN',
        timestamp: '2023-09-23T15:47:38.565Z',
        correlationId: '0838330d-606f-480a-b55f-3228e1be122d',
        contextualInfo: '',
        actionedByDisplayName: 'Ralph Gen',
      },
      {
        reference: '0a5d6abf-3504-4bb1-840b-370e3f35cd44',
        sourceReference: 'f190e844-3aa1-4f04-81d5-6be2bf9721cc',
        eventType: 'GOAL_UPDATED',
        prisonId: 'MDI',
        actionedBy: 'RALPH_GEN',
        timestamp: '2023-09-24T08:47:38.565Z',
        correlationId: '9805d096-cd52-406b-84b0-f4c1d735f3bd',
        contextualInfo: '',
        actionedByDisplayName: 'Ralph Gen',
      },
      {
        reference: 'b046eccc-eadc-4351-8e2c-c5da12fca973',
        sourceReference: '93646ba2-d0f9-42a9-9f87-3eb985ab6fe9',
        eventType: 'GOAL_COMPLETED',
        prisonId: 'MDI',
        actionedBy: 'RALPH_GEN',
        timestamp: '2023-09-29T18:47:38.565Z',
        correlationId: 'db35c8d4-d5c3-4ec8-8554-a3e31f099b3a',
        contextualInfo: '',
        actionedByDisplayName: 'Ralph Gen',
      },
    ],
  }
}
