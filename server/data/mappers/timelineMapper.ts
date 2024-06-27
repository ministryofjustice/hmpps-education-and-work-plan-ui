import { parseISO } from 'date-fns'
import type { TimelineResponse, TimelineEventResponse } from 'educationAndWorkPlanApiClient'
import type { Timeline, TimelineEvent } from 'viewModels'

const PLP_TIMELINE_EVENTS = ['ACTION_PLAN_CREATED', 'INDUCTION_UPDATED', 'GOAL_UPDATED', 'GOAL_CREATED']
const PRISON_TIMELINE_EVENTS = ['PRISON_ADMISSION', 'PRISON_RELEASE', 'PRISON_TRANSFER']
const SUPPORTED_TIMELINE_EVENTS = [...PLP_TIMELINE_EVENTS, ...PRISON_TIMELINE_EVENTS]

/**
 * Maps an API [TimelineResponse] into a view model [Timeline]
 *
 * As part of this mapping the timeline events are filtered to just those that are supported by the PLP UI
 * (The [TimelineResponse] API data includes event types that are not supported/required by the PLP UI)
 */
const toTimeline = (timelineResponse: TimelineResponse): Timeline => {
  return {
    problemRetrievingData: false,
    reference: timelineResponse.reference,
    prisonNumber: timelineResponse.prisonNumber,
    events: timelineResponse.events.filter(filterTimelineEvents).map(toTimelineEvent),
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
  } as TimelineEvent
}

const toDate = (dateString: string): Date => {
  return dateString ? parseISO(dateString) : null
}

const filterTimelineEvents = (event: TimelineEventResponse): boolean =>
  SUPPORTED_TIMELINE_EVENTS.includes(event.eventType)

export default toTimeline
