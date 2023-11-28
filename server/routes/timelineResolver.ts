/* eslint-disable no-param-reassign */
import type { TimelineResponse, TimelineEventResponse } from 'educationAndWorkPlanApiClient'
import type { TimelineEvent } from 'viewModels'
import dateComparator from './dateComparator'

const filterTimelineEvents = (timelineResponse: TimelineResponse): TimelineResponse => {
  // Filter the 'GOAL_CREATED' events and extract the correlationId values
  const goalCreatedEvents = timelineResponse.events.filter(
    (event: TimelineEventResponse): boolean => event.eventType === 'GOAL_CREATED',
  )
  const correlationIdsFromGoalCreatedEvents = goalCreatedEvents.map((event: TimelineEvent) => event.correlationId)

  // Filter the correlationId values that appear more than once, indicating that multiple goals were created in the same action
  const correlationIdsForMultipleGoals = correlationIdsFromGoalCreatedEvents.filter(
    (correlationId: string, index: string) => correlationIdsFromGoalCreatedEvents.indexOf(correlationId) !== index,
  )

  // For each correlationId value associated with multiple goals, update the event type to 'MULTIPLE_GOALS_CREATED'
  correlationIdsForMultipleGoals.forEach((correlationId: string) => {
    timelineResponse.events = timelineResponse.events.map((event: TimelineEvent) => {
      if (event.correlationId === correlationId) {
        return { ...event, eventType: 'MULTIPLE_GOALS_CREATED' }
      }
      return event
    })
  })

  // Filter the newly created 'MULTIPLE_GOALS_CREATED' events, leaving only one per correlationId to display on the UI
  timelineResponse.events = timelineResponse.events.filter(
    (event: TimelineEvent, index: number, self: TimelineEvent[]) =>
      !(event.eventType === 'MULTIPLE_GOALS_CREATED' && self[index + 1]?.correlationId === event.correlationId),
  )

  // Sort the the events by timestamp, ordering them with the most recent event first
  timelineResponse.events = timelineResponse.events.sort((left: TimelineEvent, right: TimelineEvent) =>
    dateComparator(left.timestamp, right.timestamp),
  )

  return timelineResponse
}

export default filterTimelineEvents
