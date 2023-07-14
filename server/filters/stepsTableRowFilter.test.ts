import type { AddStepDto } from 'dto'
import stepsTableRowFilter from './stepsTableRowFilter'

describe('stepsTableRowFilter', () => {
  it('should render table rows', () => {
    const steps = [
      { sequenceNumber: 1, title: 'Get on English course', targetDateRange: 'ZERO_TO_THREE_MONTHS' },
      { sequenceNumber: 2, title: 'Do course', targetDateRange: 'THREE_TO_SIX_MONTHS' },
    ] as Array<AddStepDto>

    const tableRows = stepsTableRowFilter(steps)

    expect(tableRows).toEqual([
      [{ text: '1. Get on English course' }, { text: '0 to 3 months' }],
      [{ text: '2. Do course' }, { text: '3 to 6 months' }],
    ])
  })
})
