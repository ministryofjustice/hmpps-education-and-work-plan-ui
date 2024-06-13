import formatHasWorkedBeforeFilter from './formatHasWorkedBeforeFilter'

describe('formatHasWorkedBeforeFilter', () => {
  describe('should format various values to Yes, No, Not relevant', () => {
    Array.of(
      { source: 'YES', expected: 'Yes' },
      { source: 'yes', expected: 'Yes' },

      { source: 'NO', expected: 'No' },
      { source: 'no', expected: 'No' },

      { source: 'NOT_RELEVANT', expected: 'Not relevant' },
      { source: 'not_relevant', expected: 'Not relevant' },

      { source: 'SOME_NON_SUPPORTED_VALUE', expected: undefined },
      { source: undefined, expected: undefined },
      { source: null, expected: undefined },
      { source: true, expected: undefined },
      { source: false, expected: undefined },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatHasWorkedBeforeFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
