import formatDateFormValue from './formatDateFormValue'

describe('formatDateFormValue', () => {
  describe('should format the date form snake case value into a human readable date range', () => {
    Array.of(
      { formValueDate: 'ZERO_TO_THREE_MONTHS', expected: '0 to 3 months' },
      { formValueDate: 'THREE_TO_SIX_MONTHS', expected: '3 to 6 months' },
      { formValueDate: 'SIX_TO_TWELVE_MONTHS', expected: '6 to 12 months' },
      { formValueDate: 'MORE_THAN_TWELVE_MONTHS', expected: 'More than 12 months' },
    ).forEach(spec => {
      it(`Form value date: ${spec.formValueDate}, expected text: ${spec.expected}`, () => {
        expect(formatDateFormValue(spec.formValueDate)).toEqual(spec.expected)
      })
    })
  })
})
