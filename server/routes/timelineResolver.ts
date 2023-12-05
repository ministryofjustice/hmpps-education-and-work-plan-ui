import type { Timeline, TimelineEvent } from 'viewModels'
import dateComparator from './dateComparator'

const filterTimelineEvents = (timeline: Timeline): Timeline => {
  // If there is no Timeline data or there was a problem retrieving data, return the timeline as-is
  if (!timeline || timeline.problemRetrievingData) {
    return timeline
  }

  // 'Flatten' multiple GOAL_CREATED events with the same correlationId into single MULTIPLE_GOALS_CREATED events
  const eventsGroupedByCorrelationId = groupByCorrelationId(timeline.events)
  const timelineEvents = eventsWithFlattenedCreateGoalEvents(eventsGroupedByCorrelationId)

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
 * correlationId are flattened into a single MULTIPLE_GOALS_CREATED event.
 */
const eventsWithFlattenedCreateGoalEvents = (
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

// Returns the TimelineEvents sorted by date desc, but with ACTION_PLAN_CREATED always as the last event
const sortTimelineEvents = (timelineEvents: Array<TimelineEvent>): Array<TimelineEvent> => {
  const timelineEventsSortedByDateDesc = timelineEvents.sort((left: TimelineEvent, right: TimelineEvent) =>
    dateComparator(left.timestamp, right.timestamp),
  )

  return forceActionPlanCreatedEventToLastEvent(timelineEventsSortedByDateDesc)
}

// Force ACTION_PLAN_CREATED to be the last event in the list of events that have been sorted by date desc. In theory the ACTION_PLAN_CREATED event
// should be the last event in the array (because it was the first in time to occur), but if the GOAL_CREATED events that were created with it in
// the same correlationId have the exact same time (down to the millisecond) this sorting may not always have worked as expected. So we look for it
// in the array and move it to the last event, therefore it always appears in the correct position on the timeline UI.
const forceActionPlanCreatedEventToLastEvent = (timelineEvents: Array<TimelineEvent>): Array<TimelineEvent> => {
  const actionPlanCreatedEvent = timelineEvents.find(timelineEvent => timelineEvent.eventType === 'ACTION_PLAN_CREATED')
  // If the TimelineEvents does not include a ACTION_PLAN_CREATED event (can happen for some early prisoner action plans where the timeline was not fully implemented)
  // simply return the array of TimelineEvents
  if (!actionPlanCreatedEvent) {
    return timelineEvents
  }

  const index = timelineEvents.indexOf(actionPlanCreatedEvent)
  timelineEvents.splice(index, 1)
  return [...timelineEvents, actionPlanCreatedEvent]
}

export default filterTimelineEvents
