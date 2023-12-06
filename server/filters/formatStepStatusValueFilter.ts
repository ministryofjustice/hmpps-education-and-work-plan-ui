export default function formatStepStatusValueFilter(value: string): string {
  const statusValue = StepStatusValue[value as keyof typeof StepStatusValue]
  return statusValue
}

enum StepStatusValue {
  NOT_STARTED = 'Not started',
  ACTIVE = 'Started',
  COMPLETE = 'Completed',
}
