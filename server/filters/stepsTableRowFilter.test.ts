import type { AddStepDto } from 'dto'
import stepsTableRowFilter from './stepsTableRowFilter'

describe('stepsTableRowFilter', () => {
  it('should render table rows', () => {
    const steps = [
      { title: 'Get on English course', targetDateRange: '0 to 3 months' },
      { title: 'Do course', targetDateRange: '3 to 6 months' },
    ] as Array<AddStepDto>

    const tableRows = stepsTableRowFilter(steps)

    expect(tableRows).toEqual([
      [{ text: 'Get on English course' }, { text: '0 to 3 months' }],
      [{ text: 'Do course' }, { text: '3 to 6 months' }],
    ])
  })
})
