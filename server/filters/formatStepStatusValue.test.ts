import formatStepStatusValue from './formatStepStatusValue'

describe('formatStepStatusValue', () => {
  describe('should format the goal step status API value into a user friendly value', () => {
    Array.of(
      { statusValue: 'NOT_STARTED', expected: 'Not started' },
      { statusValue: 'ACTIVE', expected: 'Started' },
      { statusValue: 'COMPLETE', expected: 'Completed' },
    ).forEach(spec => {
      it(`Step status value ${spec.statusValue}, expected text: ${spec.expected}`, () => {
        expect(formatStepStatusValue(spec.statusValue)).toEqual(spec.expected)
      })
    })
  })
})
