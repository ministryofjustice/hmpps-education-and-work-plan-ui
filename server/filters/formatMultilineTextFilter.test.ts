import formatMultilineTextFilter from './formatMultilineTextFilter'

describe('formatMultilineTextFilter', () => {
  describe('should format multiline text with <br /> elements', () => {
    Array.of(
      { source: '', expected: undefined },
      { source: null, expected: undefined },
      { source: undefined, expected: undefined },
      { source: 'Hello world!', expected: 'Hello world!' },
      {
        source: `Line 1
Line 2`,
        expected: 'Line 1<br />Line 2',
      },
      {
        source: `
Line 1
Line 2

Line 3
`,
        expected: '<br />Line 1<br />Line 2<br /><br />Line 3<br />',
      },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatMultilineTextFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
