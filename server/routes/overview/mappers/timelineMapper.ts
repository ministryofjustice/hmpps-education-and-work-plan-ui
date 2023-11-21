import type { TimelineResponse, TimelineEventResponse } from 'educationAndWorkPlanApiClient'
import type { Timeline, TimelineEvent } from 'viewModels'

const toTimeline = (timelineResponse: TimelineResponse): Timeline => {
  return {
    problemRetrievingData: false,
    reference: timelineResponse.reference,
    prisonNumber: timelineResponse.prisonNumber,
    events: timelineResponse.events.map(toTimelineEvent),
  }
}

const toTimelineEvent = (timelineEventResponse: TimelineEventResponse): TimelineEvent => {
  return {
    reference: timelineEventResponse.reference,
    sourceReference: timelineEventResponse.sourceReference,
    eventType: timelineEventResponse.eventType,
    prisonName: timelineEventResponse.prisonId, // (JIRA: 480) TODO: Lookup Prison name from the service
    timestamp: timelineEventResponse.timestamp,
    correlationId: timelineEventResponse.correlationId,
    contextualInfo: timelineEventResponse.contextualInfo,
    actionedByDisplayName: timelineEventResponse.actionedByDisplayName,
  }
}

export { toTimeline, toTimelineEvent }
