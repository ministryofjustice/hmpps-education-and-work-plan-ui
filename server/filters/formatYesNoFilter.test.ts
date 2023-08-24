import formatYesNoFilter from './formatYesNoFilter'

describe('formatYesNoFilter', () => {
  describe('should format various values to Yes, No, Not_sure', () => {
    Array.of(
      { source: 'YES', expected: 'Yes' },
      { source: 'yes', expected: 'Yes' },
      { source: 'Y', expected: 'Yes' },
      { source: 'y', expected: 'Yes' },
      { source: true, expected: 'Yes' },

      { source: 'NO', expected: 'No' },
      { source: 'no', expected: 'No' },
      { source: 'N', expected: 'No' },
      { source: 'n', expected: 'No' },
      { source: false, expected: 'No' },

      { source: 'NOT_SURE', expected: 'Not sure' },
      { source: 'not_sure', expected: 'Not sure' },

      { source: 'SOME_NON_SUPPORTED_VALUE', expected: undefined },
      { source: undefined, expected: undefined },
      { source: null, expected: undefined },
      { source: 'true', expected: undefined },
      { source: 'false', expected: undefined },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatYesNoFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
