import type { AddStepDto } from 'dto'

type TableCell = {
  text?: string
  html?: string
}

export default function stepsTableRowFilter(steps: Array<AddStepDto>): Array<Array<TableCell>> {
  return steps.map(step => {
    return Array.of({ text: step.title }, { text: step.targetDateRange })
  })
}
