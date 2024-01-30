import type { Timeline, TimelineEvent } from 'viewModels'
import moment from 'moment'
import dateComparator from './dateComparator'

const filterTimelineEvents = (timeline: Timeline): Timeline => {
  // If there is no Timeline data or there was a problem retrieving data, return the timeline as-is
  if (!timeline || timeline.problemRetrievingData) {
    return timeline
  }

  // Merge multiple GOAL_CREATED events with the same correlationId into single MULTIPLE_GOALS_CREATED events
  const eventsGroupedByCorrelationId = groupByCorrelationId(timeline.events)
  const timelineEvents = eventsWithMergedCreateGoalEvents(eventsGroupedByCorrelationId)

  return {
    ...timeline,
    events: sortTimelineEvents(timelineEvents), // sorted by date desc, but with ACTION_PLAN_CREATED always as the last event
  }
}

/**
 * Takes an array of TimelineEvent and returns a map keyed by correlationId whose value is an array of TimelineEvents sharing
 * the same correlationId.
 */
const groupByCorrelationId = (items: Array<TimelineEvent>): Record<string, Array<TimelineEvent>> =>
  items.reduce(
    (result: Record<string, Array<TimelineEvent>>, item: TimelineEvent) => ({
      ...result,
      [item.correlationId]: [...(result[item.correlationId] || []), item],
    }),
    {},
  )

/**
 * Takes the events grouped by correlationId and returns an array of events where multiple GOAL_CREATED events in the same
 * correlationId are merged into a single MULTIPLE_GOALS_CREATED event.
 */
const eventsWithMergedCreateGoalEvents = (
  eventsGroupedByCorrelationId: Record<string, Array<TimelineEvent>>,
): Array<TimelineEvent> => {
  return Object.values(eventsGroupedByCorrelationId)
    .flatMap(timelineEvents => {
      const nonGoalCreatedEvents = timelineEvents.filter(timelineEvent => timelineEvent.eventType !== 'GOAL_CREATED')
      const goalCreatedEvents = timelineEvents.filter(timelineEvent => timelineEvent.eventType === 'GOAL_CREATED')
      return Array.of(
        ...nonGoalCreatedEvents,
        goalCreatedEvents.length > 1
          ? ({
              ...goalCreatedEvents[goalCreatedEvents.length - 1],
              eventType: 'MULTIPLE_GOALS_CREATED',
            } as TimelineEvent)
          : goalCreatedEvents[0],
      )
    })
    .filter(timelineEvent => !!timelineEvent)
}

// Returns the TimelineEvents sorted by date desc, but with ACTION_PLAN_CREATED always after any related GOAL_CREATED events
const sortTimelineEvents = (timelineEvents: Array<TimelineEvent>): Array<TimelineEvent> => {
  const updatedTimelineEvents = modifyActionPlanCreatedTimestamp(timelineEvents)
  const timelineEventsSortedByDateDesc = updatedTimelineEvents.sort((left: TimelineEvent, right: TimelineEvent) =>
    dateComparator(left.timestamp, right.timestamp),
  )

  return timelineEventsSortedByDateDesc
}

// Ensure the ACTION_PLAN_CREATED event appears after any related GOAL_CREATED events that were created at the same time. In theory
// the ACTION_PLAN_CREATED event should be the last event in the array (because it was the first in time to occur), but if the
// related GOAL_CREATED events have the exact same time (down to the millisecond), then this sorting may not always have worked as
// expected. This method looks for the ACTION_PLAN_CREATED event in the array and subtracts a second from its timestamp, thereby
// ensuring it always appears in the correct position on the timeline UI.
const modifyActionPlanCreatedTimestamp = (timelineEvents: Array<TimelineEvent>): Array<TimelineEvent> => {
  const actionPlanCreatedEvent = timelineEvents.find(timelineEvent => timelineEvent.eventType === 'ACTION_PLAN_CREATED')
  // If the TimelineEvents do not include a ACTION_PLAN_CREATED event then simply return the array of TimelineEvents
  if (!actionPlanCreatedEvent) {
    return timelineEvents
  }
  const mutatedActionPlanEvent = {
    ...actionPlanCreatedEvent,
    timestamp: moment.utc(actionPlanCreatedEvent.timestamp).subtract(1, 'second').toDate(),
  }
  const index = timelineEvents.indexOf(actionPlanCreatedEvent)
  timelineEvents.splice(index, 1, mutatedActionPlanEvent)
  return timelineEvents
}

export default filterTimelineEvents
