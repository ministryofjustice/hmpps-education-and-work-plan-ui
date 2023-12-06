import formatTimelineEventFilter from './formatTimelineEventFilter'

describe('formatTimelineEventFilter', () => {
  describe('should format the goal step status API value into a user friendly value', () => {
    Array.of(
      { timelineEventValue: 'ACTION_PLAN_CREATED', expected: 'Learning and work progress plan created' },
      { timelineEventValue: 'INDUCTION_UPDATED', expected: 'Learning and work progress plan updated' },
      { timelineEventValue: 'GOAL_UPDATED', expected: 'Goal updated' },
      { timelineEventValue: 'GOAL_CREATED', expected: 'Goal added' },
      { timelineEventValue: 'MULTIPLE_GOALS_CREATED', expected: 'Goals added' },
    ).forEach(spec => {
      it(`Timeline event value ${spec.timelineEventValue}, expected text: ${spec.expected}`, () => {
        expect(formatTimelineEventFilter(spec.timelineEventValue)).toEqual(spec.expected)
      })
    })
  })
})
