/* eslint-disable no-param-reassign */
import type { Timeline, TimelineEvent } from 'viewModels'
import dateComparator from './dateComparator'

const filterTimelineEvents = (timeline: Timeline): Timeline => {
  // If there is no Timeline data, return the timeline as-is
  if (!timeline || timeline.problemRetrievingData) {
    return timeline
  }

  // Filter the 'GOAL_CREATED' events and extract the correlationId values
  const goalCreatedEvents = timeline.events.filter(
    (event: TimelineEvent): boolean => event.eventType === 'GOAL_CREATED',
  )
  const correlationIdsFromGoalCreatedEvents = goalCreatedEvents.map((event: TimelineEvent) => event.correlationId)

  // Filter the correlationId values that appear more than once, indicating that multiple goals were created in the same action
  const correlationIdsForMultipleGoals = correlationIdsFromGoalCreatedEvents.filter(
    (correlationId: string, index: number, self: string[]) => self.indexOf(correlationId) !== index,
  )

  // For each correlationId value associated with multiple goals, update the event type to 'MULTIPLE_GOALS_CREATED'
  correlationIdsForMultipleGoals.forEach((correlationId: string) => {
    timeline.events = timeline.events.map((event: TimelineEvent) => {
      if (event.correlationId === correlationId) {
        return { ...event, eventType: 'MULTIPLE_GOALS_CREATED' }
      }
      return event
    })
  })

  // Filter the newly created 'MULTIPLE_GOALS_CREATED' events, leaving only one per correlationId to display on the UI
  timeline.events = timeline.events.filter(
    (event: TimelineEvent, index: number, self: TimelineEvent[]) =>
      !(event.eventType === 'MULTIPLE_GOALS_CREATED' && self[index + 1]?.correlationId === event.correlationId),
  )

  // Sort the the events by timestamp, ordering them with the most recent event first
  timeline.events = timeline.events.sort((left: TimelineEvent, right: TimelineEvent) =>
    dateComparator(left.timestamp, right.timestamp),
  )

  return timeline
}

export default filterTimelineEvents
