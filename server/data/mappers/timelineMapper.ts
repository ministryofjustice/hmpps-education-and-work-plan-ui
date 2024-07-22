import { parseISO } from 'date-fns'
import type { TimelineResponse, TimelineEventResponse } from 'educationAndWorkPlanApiClient'
import type { Timeline, TimelineEvent } from 'viewModels'

/**
 * Maps an API [TimelineResponse] into a view model [Timeline]
 *
 * As part of this mapping the timeline events are filtered to just those that are supported by the PLP UI
 * (The [TimelineResponse] API data includes event types that are not supported/required by the PLP UI)
 */
const toTimeline = (timelineResponse: TimelineResponse, prisonNamesById: Map<string, string>): Timeline => {
  return {
    problemRetrievingData: false,
    reference: timelineResponse.reference,
    prisonNumber: timelineResponse.prisonNumber,
    events: timelineResponse.events.map((event: TimelineEventResponse) => toTimelineEvent(event, prisonNamesById)),
  }
}

const toTimelineEvent = (
  timelineEventResponse: TimelineEventResponse,
  prisonNamesById: Map<string, string>,
): TimelineEvent => {
  return {
    reference: timelineEventResponse.reference,
    sourceReference: timelineEventResponse.sourceReference,
    eventType: timelineEventResponse.eventType,
    prisonName: prisonNamesById.get(timelineEventResponse.prisonId) || timelineEventResponse.prisonId,
    timestamp: toDate(timelineEventResponse.timestamp),
    correlationId: timelineEventResponse.correlationId,
    contextualInfo: isPrisonTransfer(timelineEventResponse)
      ? {
          PRISON_TRANSFERRED_FROM:
            prisonNamesById.get(timelineEventResponse.contextualInfo.PRISON_TRANSFERRED_FROM) ||
            timelineEventResponse.contextualInfo.PRISON_TRANSFERRED_FROM,
        }
      : timelineEventResponse.contextualInfo,
    actionedByDisplayName: timelineEventResponse.actionedByDisplayName,
  } as TimelineEvent
}

const isPrisonTransfer = (event: TimelineEvent): boolean => event.eventType === 'PRISON_TRANSFER'

const toDate = (dateString: string): Date => {
  return dateString ? parseISO(dateString) : null
}

export default toTimeline
