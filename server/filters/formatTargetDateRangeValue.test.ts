import formatTargetDateRangeValue from './formatTargetDateRangeValue'

describe('formatTargetDateRangeValue', () => {
  describe('should format the date form snake case value into a human readable date range', () => {
    Array.of(
      { dateRangeValue: 'ZERO_TO_THREE_MONTHS', expected: '0 to 3 months' },
      { dateRangeValue: 'THREE_TO_SIX_MONTHS', expected: '3 to 6 months' },
      { dateRangeValue: 'SIX_TO_TWELVE_MONTHS', expected: '6 to 12 months' },
      { dateRangeValue: 'MORE_THAN_TWELVE_MONTHS', expected: 'More than 12 months' },
    ).forEach(spec => {
      it(`Form value date: ${spec.dateRangeValue}, expected text: ${spec.expected}`, () => {
        expect(formatTargetDateRangeValue(spec.dateRangeValue)).toEqual(spec.expected)
      })
    })
  })
})
