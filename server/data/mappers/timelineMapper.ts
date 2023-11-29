import type { TimelineResponse, TimelineEventResponse } from 'educationAndWorkPlanApiClient'
import moment from 'moment'
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
    prison: {
      prisonId: timelineEventResponse.prisonId,
      prisonName: undefined, // This mapper cannot look up / resolve the prisonName; that has to be post-processed
    },
    timestamp: toDate(timelineEventResponse.timestamp),
    correlationId: timelineEventResponse.correlationId,
    contextualInfo: timelineEventResponse.contextualInfo,
    actionedByDisplayName: timelineEventResponse.actionedByDisplayName,
  }
}

const toDate = (dateString: string): Date => {
  return dateString ? moment(dateString).toDate() : null
}

export { toTimeline, toTimelineEvent }
