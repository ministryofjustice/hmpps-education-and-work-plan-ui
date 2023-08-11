export default function formatStepStatusValue(value: string): string {
  const statusValue = StepStatusValue[value as keyof typeof StepStatusValue]
  return statusValue
}

export enum StepStatusValue {
  NOT_STARTED = 'Not started',
  ACTIVE = 'Started',
  COMPLETE = 'Completed',
}
