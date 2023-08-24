export default function formatGoalStatusValue(value: string): string {
  const statusValue = GoalStatusValue[value as keyof typeof GoalStatusValue]
  return statusValue
}

enum GoalStatusValue {
  ACTIVE = 'In progress',
  COMPLETED = 'Completed',
  ARCHIVED = 'Archived',
}
