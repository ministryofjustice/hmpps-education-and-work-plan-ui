import formatTimelineEvent from './formatTimelineEvent'

describe('formatTimelineEvent', () => {
  describe('should format the goal step status API value into a user friendly value', () => {
    Array.of({
      timelineEventValue: 'ACTION_PLAN_CREATED',
      expected: 'Learning and work progress plan created',
    }).forEach(spec => {
      it(`Timeline event value ${spec.timelineEventValue}, expected text: ${spec.expected}`, () => {
        expect(formatTimelineEvent(spec.timelineEventValue)).toEqual(spec.expected)
      })
    })
  })
})
