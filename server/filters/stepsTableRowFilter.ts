import type { AddStepDto } from 'dto'

type TableCell = {
  text?: string
  html?: string
}

export default function stepsTableRowFilter(steps: Array<AddStepDto>): Array<Array<TableCell>> {
  return steps.map(step => {
    const targetDateRange = TargetDateRange[step.targetDateRange as keyof typeof TargetDateRange]
    return Array.of({ text: `${step.sequenceNumber}. ${step.title}` }, { text: targetDateRange })
  })
}

export enum TargetDateRange {
  ZERO_TO_THREE_MONTHS = '0 to 3 months',
  THREE_TO_SIX_MONTHS = '3 to 6 months',
  SIX_TO_TWELVE_MONTHS = '6 to 12 months',
  MORE_THAN_TWELVE_MONTHS = 'More than 12 months',
}
