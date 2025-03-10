import type { Timeline, TimelineEvent } from 'viewModels'
import { subSeconds } from 'date-fns'
import dateComparator from '../dateComparator'
import TimelineEventTypeValue from '../../enums/timelineEventTypeValue'

const SYSTEM_USER = 'system'

/**
 * Prepares a [Timeline] for rendering in the view.
 * Specifically this means:
 *   * grouping GOAL_CREATED events with the same correlationId into single MULTIPLE_GOALS_CREATED events
 *   * sorting events chronologically
 *   * ensuring that the ACTION_PLAN_CREATED event appears before any related GOAL_CREATED events
 *   * removing any INDUCTION_SCHEDULE_STATUS_UPDATED events that were created by 'system'
 *      eg: prisoner transfer/death/re-admission events
 *   * removing any ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED events that were created by 'system'
 *      eg: prisoner transfer/death/re-admission events
 */
const prepareTimelineForView = (timeline: Timeline): Timeline => {
  // If there is no Timeline data or there was a problem retrieving data, return the timeline as-is
  if (!timeline || timeline.problemRetrievingData) {
    return timeline
  }

  // Merge multiple GOAL_CREATED events with the same correlationId into single MULTIPLE_GOALS_CREATED events
  const eventsGroupedByCorrelationId = groupByCorrelationId(timeline.events)
  const timelineEvents = eventsWithMergedCreateGoalEvents(eventsGroupedByCorrelationId)

  return {
    ...timeline,
    events: sortTimelineEvents(
      // sorted by date desc, but with ACTION_PLAN_CREATED always as the last event
      timelineEvents
        .filter(
          // filter out INDUCTION_SCHEDULE_STATUS_UPDATED events that were created by 'system
          timelineEvent =>
            !(
              timelineEvent.eventType === TimelineEventTypeValue.INDUCTION_SCHEDULE_STATUS_UPDATED &&
              timelineEvent.actionedByDisplayName === SYSTEM_USER
            ),
        )
        .filter(
          // filter out ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED events that were created by 'system'
          timelineEvent =>
            !(
              timelineEvent.eventType === TimelineEventTypeValue.ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED &&
              timelineEvent.actionedByDisplayName === SYSTEM_USER
            ),
        ),
    ),
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
      const nonGoalCreatedEvents = timelineEvents.filter(
        timelineEvent => timelineEvent.eventType !== TimelineEventTypeValue.GOAL_CREATED,
      )
      const goalCreatedEvents = timelineEvents.filter(
        timelineEvent => timelineEvent.eventType === TimelineEventTypeValue.GOAL_CREATED,
      )
      return Array.of(
        ...nonGoalCreatedEvents,
        goalCreatedEvents.length > 1
          ? ({
              ...goalCreatedEvents[goalCreatedEvents.length - 1],
              contextualInfo: goalCreatedEvents // Map all the goal created events contextualInfo properties into an object containing them all with an incremental number
                .map((event, idx) =>
                  idx > 0 ? event.contextualInfo : { GOAL_TITLE_0: event.contextualInfo.GOAL_TITLE },
                )
                .reduce((previous, current, idx) => ({
                  ...previous,
                  [`GOAL_TITLE_${idx}`]: current.GOAL_TITLE,
                })),
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

// Ensure the ACTION_PLAN_CREATED event appears before any related GOAL_CREATED events that were created at the same time. In theory
// the ACTION_PLAN_CREATED event should be before its related GOAL_CREATED events (because it was the first to occur). However, if
// the related GOAL_CREATED events have the exact same time (down to the millisecond), then this sorting may not always have worked
// as expected. This method looks for the ACTION_PLAN_CREATED event in the array and subtracts a second from its timestamp, thereby
// ensuring it always appears in the correct position on the timeline UI.
// Whilst modifying such data is usually best avoided, the milliseconds are of no interest to the UI and the alternative of
// manipulating the array would be far more complicated.
const modifyActionPlanCreatedTimestamp = (timelineEvents: Array<TimelineEvent>): Array<TimelineEvent> => {
  const actionPlanCreatedEvent = timelineEvents.find(
    timelineEvent => timelineEvent.eventType === TimelineEventTypeValue.ACTION_PLAN_CREATED,
  )
  // If the TimelineEvents do not include a ACTION_PLAN_CREATED event then simply return the array of TimelineEvents
  if (!actionPlanCreatedEvent) {
    return timelineEvents
  }
  const mutatedActionPlanEvent = {
    ...actionPlanCreatedEvent,
    timestamp: subSeconds(actionPlanCreatedEvent.timestamp, 1),
  }
  const index = timelineEvents.indexOf(actionPlanCreatedEvent)
  timelineEvents.splice(index, 1, mutatedActionPlanEvent)
  return timelineEvents
}

export default prepareTimelineForView
