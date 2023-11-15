import formatTimelineEvent from './formatTimelineEvent'

describe('formatTimelineEvent', () => {
  describe('should format the goal step status API value into a user friendly value', () => {
    Array.of(
      { timelineEventValue: 'ACTION_PLAN_CREATED', expected: 'Action plan created' },
      { timelineEventValue: 'GOAL_CREATED', expected: 'Goal created' },
      { timelineEventValue: 'GOAL_UPDATED', expected: 'Goal updated' },
      { timelineEventValue: 'GOAL_STARTED', expected: 'Goal started' },
      { timelineEventValue: 'GOAL_COMPLETED', expected: 'Goal completed' },
      { timelineEventValue: 'GOAL_ARCHIVED', expected: 'Goal archived' },
      { timelineEventValue: 'STEP_UPDATED', expected: 'Step updated' },
      { timelineEventValue: 'STEP_NOT_STARTED', expected: 'Step not started' },
      { timelineEventValue: 'STEP_STARTED', expected: 'Step started' },
      { timelineEventValue: 'STEP_COMPLETED', expected: 'Step completed' },
      { timelineEventValue: 'INDUCTION_UPDATED', expected: 'Induction updated' },
      { timelineEventValue: 'INDUCTION_CREATED', expected: 'Induction created' },
    ).forEach(spec => {
      it(`Timeline event value ${spec.timelineEventValue}, expected text: ${spec.expected}`, () => {
        expect(formatTimelineEvent(spec.timelineEventValue)).toEqual(spec.expected)
      })
    })
  })
})
