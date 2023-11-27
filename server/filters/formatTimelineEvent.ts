export default function formatTimelineEvent(value: string): string {
  const timelineEventValue = TimelineEventValue[value as keyof typeof TimelineEventValue]
  return timelineEventValue
}

enum TimelineEventValue {
  ACTION_PLAN_CREATED = 'Learning and work progress plan created',
  INDUCTION_UPDATED = 'Learning and work progress plan updated',
  GOAL_UPDATED = 'Goal updated',
  GOAL_CREATED = 'Goal created',
  MULTIPLE_GOALS_CREATED = 'Goals created',
}