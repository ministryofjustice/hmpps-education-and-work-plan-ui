export default function formatTimelineEvent(value: string): string {
  const timelineEventValue = TimelineEventValue[value as keyof typeof TimelineEventValue]
  return timelineEventValue
}

enum TimelineEventValue {
  ACTION_PLAN_CREATED = 'Action plan created',
  GOAL_CREATED = 'Goal created',
  GOAL_UPDATED = 'Goal updated',
  GOAL_STARTED = 'Goal started',
  GOAL_COMPLETED = 'Goal completed',
  GOAL_ARCHIVED = 'Goal archived',
  STEP_UPDATED = 'Step updated',
  STEP_NOT_STARTED = 'Step not started',
  STEP_STARTED = 'Step started',
  STEP_COMPLETED = 'Step completed',
  INDUCTION_UPDATED = 'Induction updated',
  INDUCTION_CREATED = 'Induction created',
}
