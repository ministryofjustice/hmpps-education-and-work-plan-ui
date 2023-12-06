import formatGoalStatusValueFilter from './formatGoalStatusValueFilter'

describe('formatStepStatusValueFilter', () => {
  describe('should format the goal status API value into a user friendly value', () => {
    Array.of(
      { statusValue: 'ACTIVE', expected: 'In progress' },
      { statusValue: 'COMPLETED', expected: 'Completed' },
      { statusValue: 'ARCHIVED', expected: 'Archived' },
    ).forEach(spec => {
      it(`Goal status value ${spec.statusValue}, expected text: ${spec.expected}`, () => {
        expect(formatGoalStatusValueFilter(spec.statusValue)).toEqual(spec.expected)
      })
    })
  })
})
